import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { AlertController, NavController, App } from 'ionic-angular';
import { NgModel } from '@angular/forms';
import { OrganizationServices } from '../../lib/service/organization';
import { AddAttendeesModal } from '../events/add-attendees/add-attendees-modal';
import { ModalController } from 'ionic-angular';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { SignupAssistant } from '../../lib/service/signupassistant';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';


@Component({
    templateUrl: 'eventsignup_modal.html',
    providers: [OrganizationServices]
})


export class EventSignupModal {
    public orgData: Array<any> = [];
    private myOrgs;
    private orgContactData: Array<any> = [];
    private orgContacts;
    private isGroupAdmin;
    private eventData;
    private groupData;
    private eventType;
    private signupSuccess = false;
    selectedMembers;
    signuptype = 'individual';
    optionSelected = false;
    showMembers = false;
    showGroups = false;
    submitText = "Next";
    selectedGroup;
    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public toastController: ToastController,
        public modalCtrl: ModalController,
        public appCtrl: App,
        public navController: NavController,
        public signupassistant: SignupAssistant,
        private volunteerServices: VolunteerEventsService,
        public orgServices: OrganizationServices) {
        this.viewCtrl = viewCtrl;
        this.myOrgs = [];
        this.selectedMembers = [];
        this.eventData = params.get('event_data');
        this.isGroupAdmin = params.get('is_admin');
        this.eventType = this.eventData.org_restriction != undefined ? this.eventData.org_restriction : this.eventData.eventexpanded.org_restriction;

    }

    ionViewWillEnter() {
        this.loadData();
    }

    loadData() {

        var page = this;
        this.orgServices.getMyOrganizations().subscribe(orgData => {

            for (var data of orgData) {
                page.myOrgs.push({ 'name': data.name, 'group': data.group, 'org_id': data.organization_id });
            }

        },
            err => {

            });
    }

    dismiss() {
       //Dismiss with boolean signupSuccess
        this.viewCtrl.dismiss(this.signupSuccess);
    }

    displayGroups() {
        this.showGroups = true;
        this.showMembers = false;
    }

    displayMembers() {
        this.showMembers = true;
        this.showGroups = false;
    }

    updateButtonText(val) {
        if (val == 'individual') {
            this.submitText = 'Finish';
        } else {
            this.submitText = 'Next';
        }
    }

    submit(signupType) {

        if (signupType == 'individual') {
            //Do Individual signup
            this.doIndividualSignup();

        } else {
            //Populate Group Data
            this.displayGroups();
        }
    }

    updateMembers(contact) {
        if (contact.checked) {
            //Add To Array
            this.selectedMembers.push(contact.contact)
        } else {
            //Remove from Arary. Is this safe for all browsers?
            this.selectedMembers = this.selectedMembers.filter(function (data) {
                return data.ext_id !== contact.contact.ext_id
            });
        }
    }

    getOrgContacts(org_id) {
        var page = this;
        this.orgServices.getOrgContacts(org_id).subscribe(orgContactData => {
            //page.orgContacts = orgContactData.members;
            page.orgContacts = [];
            // page.orgContacts = [{}];
            for (var i in orgContactData.members) {
                page.orgContacts.push({ contact: orgContactData.members[i], checked: true });
                // page.orgContacts[i].checked = false;
                page.selectedMembers.push(orgContactData.members[i]);
            }

            page.displayMembers();

        },
            err => {

            });

    }

    doIndividualSignup() {

        this.signupassistant.setCurrentEventId(this.eventData.id);
        this.volunteerServices
            .checkMyEventsNew(this.signupassistant.getCurrentEventId()).subscribe(
            res => {
                this.signupassistant.signupEventRegistration();
                this.signupSuccess = true;
            },
            err => {
                this.signupSuccess = false;

                if (err._body.indexOf("Event registration is full") > 0) {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'Event Registration is full. We encourage you to search for similar events scheduled.',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {

                                }
                            }
                        ]
                    });
                    confirm.present();
                } else {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'YOU have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the My Profile page?',
                        buttons: [
                            {
                                text: 'No',
                                handler: () => {

                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    this.viewCtrl.dismiss();
                                    this.appCtrl.getRootNav().push(RegisterIndividualProfilePage,{errorResponse:err});
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            },
            () => {
                if(this.signupSuccess){
                    this.dismiss();
                }
                //this.dismiss(this.signupSuccess);
            });
    }

    doGroupSignUp() {
        var page = this;

        this.orgServices
            .groupRegisterForEvent(this.selectedGroup, this.eventData.id, this.selectedMembers, 0).subscribe(
            res => {

                let confirm = this.alertCtrl.create({
                    title: '',
                    cssClass: 'alertReminder',
                    message: 'Group Sign-up successful',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {
                                page.signupSuccess = true;
                                page.dismiss();
                            }
                        }
                    ]
                });
                confirm.present();

            },
            err => {
                console.log(err);
                let confirm = this.alertCtrl.create({
                    title: '',
                    cssClass: 'alertReminder',
                    message: 'Group Sign-up Failed',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {
                                page.signupSuccess = false;
                            }
                        }
                    ]
                });
            },
            () => {
                //Do some stuff
            });
    }

    addAttendee(groupId) {
        let page = this;
        let confirm = this.alertCtrl.create({
            title: 'Add additional Attendee',
            cssClass: 'alertReminder',
            message: 'Email or Phone Number ### ### ####',
            inputs: [
                {
                    name: 'first_name',
                    placeholder: 'First Name'
                },
                {
                    name: 'last_name',
                    placeholder: 'Last Name'
                },
                {
                    name: 'email_phone',
                    placeholder: 'Email/Phone',
                }
            ],
            buttons: [
                {
                    text: 'Add',
                    handler: data => {
                        let contactMethod;
                        let jsonObj = { "contact": {}, "checked": true };
                        // Do Validation of Contact Type

                        var contact = page.validateContactMethod(data.email_phone);
                        if (contact == false) {
                            this.presentToast('Invalid contact Method.');
                        } else if (data.first_name.length == 0) {
                            this.presentToast('First name cannot be empty.');

                        } else if (data.last_name.length == 0) {
                            this.presentToast('Last name cannot be empty.');
                        } else {
                            if (contact == 'email') {
                                contactMethod = 'Email';
                                jsonObj.contact = { "status": 3, "mobilenumber": null, "first_name": data.first_name, "last_name": data.last_name, "contact_method": contactMethod, "role": 0, "email": data.email_phone };
                            } else {
                                contactMethod = 'Phone';
                                jsonObj.contact = { "status": 3, "mobilenumber": data.email_phone, "first_name": data.first_name, "last_name": data.last_name, "contact_method": contactMethod, "role": 0, "email": null };
                            }
                            this.selectedMembers.push(jsonObj.contact);
                            page.orgContacts.push(jsonObj);
                            page.orgContacts = page.orgContacts.slice();
                        }
                    }

                },
                {
                    text: 'Cancel',
                    handler: () => {

                    }
                }
            ]
        });
        confirm.present();

        this.groupData = this.myOrgs.filter(function (data) {
            return data.org_id == groupId
        });

    }

    validatePhoneNumber(data) {
        let phonenum = data;
        let regex = /^(([0-9]{3}))[-. ]?([0-9]{3})[-. ]?([0-9]{4})/ig;

        if (phonenum.match(regex)) {
            return true;
        } else {
            return false;
        }
    }

    validateEmail(data) {
        let email = data

        if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
            return false;
        } else {
            return true;
        }
    }
    //check to see whether expression is a phone number or an email
    validateContactMethod(data) {
        let contact = data;

        if (this.validateEmail(contact)) {

            return 'email';
        } else if (this.validatePhoneNumber(data)) {

            return 'phone';
        } else {
            return false;
        }

    }

    presentToast(message: string) {
        let toast = this.toastController.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    }
}
