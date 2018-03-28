import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { AlertController, NavController, App } from 'ionic-angular';
import { NgModel } from '@angular/forms';
import { OrganizationServices } from '../../lib/service/organization';
import { AddAttendeesModal } from '../events/add-attendees/add-attendees-modal';
import { ModalController } from 'ionic-angular';
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
    private pushPage: any;
    private groupData;
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
        public signupassitant: SignupAssistant,
        private volunteerServices: VolunteerEventsService,
        public orgServices: OrganizationServices) {
        this.viewCtrl = viewCtrl;
        this.myOrgs = [];
        this.selectedMembers = [];
        this.eventData = params.get('event_data');
        this.isGroupAdmin = params.get('is_admin');

    }

    ngOnInit() {
        console.log(this.eventData);
    }

    ionViewWillEnter() {
        // console.log("Entered the eventSignup Modal");
        this.loadData();
    }

    loadData() {

        var page = this;
        this.orgServices.getMyOrganizations().subscribe(orgData => {
        /*    var isAdmin;
            if (orgData.length > 0) {
                console.log("You have at least 1 group");
                isAdmin = true;
            } else {
                isAdmin = false;
            }
        */
            for (var data of orgData) {
                page.myOrgs.push({ 'name': data.name, 'group': data.group, 'org_id': data.organization_id });
            }
            //page.isGroupAdmin = isAdmin;
            //page.isGroupAdmin = isAdmin;

        },
            err => {

            });




    }

    dismiss() {
        this.viewCtrl.dismiss();
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
            console.log("Individual Signup")
            //Do Individual signup
            this.doSignUp2();

        } else {
            console.log("Group Signup");
            //Populate Group Data
            this.displayGroups();
        }
    }

    pickGroup() {
        console.log("Value selected: " + this.selectedGroup);
    }

    updateMembers(contact) {


        console.log(contact);

        if (contact.checked) {
            //Add To Array
            this.selectedMembers.push(contact.contact)
            //console.log("checked: " + JSON.stringify(this.selectedMembers));
        } else {
            //Remove from Arary. Is this safe for all browsers?
            this.selectedMembers = this.selectedMembers.filter(function (data) {
                return data.ext_id !== contact.contact.ext_id
            });
            //console.log("unchecked: " + JSON.stringify(this.selectedMembers));
        }
    }

    getOrgContacts(org_id) {
        var page = this;
        console.log('org_id: ' + org_id);
        this.orgServices.getOrganizationContacts(org_id).subscribe(orgContactData => {
            //page.orgContacts = orgContactData.members;
            page.orgContacts = [];
            // page.orgContacts = [{}];
            for (var i in orgContactData.members) {
                //console.log(orgContactData.members[i]);
                page.orgContacts.push({ contact: orgContactData.members[i], checked: false });
                // page.orgContacts[i].checked = false;
            }
            console.log(JSON.stringify(page.orgContacts));
            page.displayMembers();

        },
            err => {

            });

    }

    doSignUp2() {

        this.signupassitant.setCurrentEventId(this.eventData.id);
        this.volunteerServices
            .checkMyEventsNew(this.signupassitant.getCurrentEventId()).subscribe(
            res => {
                this.signupassitant.signupEventRegistration();
                console.log("Success");
            },
            err => {
                console.log(err);
                if (err._body.indexOf("Event registration is full") > 0) {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'Event Registration is full. We encourage you to search for similar events scheduled.',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {
                                    console.log('Ok, clicked');
                                }
                            }
                        ]
                    });
                    confirm.present();
                } else {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'YOU have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the About Me page?',
                        buttons: [
                            {
                                text: 'No',
                                handler: () => {
                                    console.log('No clicked');
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    console.log('Yes clicked');
                                    //      this.nav.push(RegisterIndividualProfilePage, { errorResponse: err });
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            });
    }

    doGroupSignUp() {
        /*
        var page = this;
        this.signupassitant.setCurrentEventId(this.eventData.id);
        this.volunteerServices
        .checkMyEventsNew(this.signupassitant.getCurrentEventId()).subscribe(
        res => {
            //console.log(JSON.stringify(this.selectedMembers));
          this.orgServices.groupRegisterForEvent(this.selectedGroup, this.eventData.id, this.selectedMembers, 0);
          //this.orgServices.getOrgRegistrations(this.selectedGroup, this.eventData.id);
          console.log("Success");
        },
        err => {
          console.log(err);
        });
*/
        var page = this;
        this.orgServices
            .groupRegisterForEvent(this.selectedGroup, this.eventData.id, this.selectedMembers, 0).subscribe(
            res => {
                //console.log("RES: " + JSON.stringify(res));
                let confirm = this.alertCtrl.create({
                    title: '',
                    cssClass: 'alertReminder',
                    message: 'Group Sign-up successful',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {
                                this.dismiss();
                            }
                        }
                    ]
                });
                confirm.present();
                // this.orgServices.groupRegisterForEvent(this.selectedGroup, this.eventData.id, this.selectedMembers, 0);
                //this.orgServices.getOrgRegistrations(this.selectedGroup, this.eventData.id);
                console.log("Success");
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
                                //this.dismiss();
                            }
                        }
                    ]
                });
            });
    }

    doSignUp() {
        console.log("Did Signup!");
        //Continue with existing logic
        console.log("E.id: " + this.eventData.id);
        this.volunteerServices.setNotificationOption(0);
        this.volunteerServices.setNotificationSchedule(0);
        this.volunteerServices.setCurrentEventId(this.eventData.id);

        this.volunteerServices.checkMyEventsNew(this.eventData.id).subscribe(
            res => {
                this.volunteerServices.eventRegisterAndSetReminder(this.eventData.id, 0, 0, false);
                console.log("Success");
            },
            err => {
                console.log("Failed");
            });
    }

    addAttendee(groupId) {
        let confirm = this.alertCtrl.create({
            title: '',
            cssClass: 'alertReminder',
            message: 'Add Attendee',
            inputs: [
                {
                    name: 'First Name',
                    placeholder: 'First Name'
                },
                {
                    name: 'Last Name',
                    placeholder: 'Last Name'
                },
                 {
                    name: 'Contact Type',
                    placeholder: 'Contact'
                }
            ],
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        //console.log('Ok, clicked');
                        //this.orgContacts.push()
                    }
                }
            ]
        });
        confirm.present();



        console.log("ABC: " + groupId);

        this.groupData = this.myOrgs.filter(function (data) {
            console.log(data.org_id + " | " + groupId);
            return data.org_id == groupId
        });
        console.log("BCD: " + JSON.stringify(this.groupData));
        //push value to the attendee Array


        this.pushPage = AddAttendeesModal;
        this.modalCtrl.create(AddAttendeesModal, this.groupData);
        //  this.navController.push(this.pushPage, this.groupData);

    }

}
