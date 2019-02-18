import { Component, Input } from '@angular/core';
import { NavParams, ViewController, ToastController, ModalController, Events } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { SignupAssistant } from '../../lib/service/signupassistant';
import { EventSignupModal } from './eventsignup_modal';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { AlertController, App, NavController} from 'ionic-angular';
import { NOTIFICATION_SCHEDULE, NOTIFICATION_OPTIONS, AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, 
         EVENT_STATUS, SAMEDAY_RESTRICTION, ORG_RESTRICTION } from './../../lib/provider/eventConstants';
import { LoginPage } from '../login/login';
import { RegisterLoginPage } from '../register-login/register-login';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { OrganizationServices } from '../../lib/service/organization';

@Component({
    templateUrl: 'eventdetail_modal.html',
    providers: [OrganizationServices]
})

export class EventDetailModal {

    eventId: string;
    myEvent: any;
    eventDetail: EventDetail;
    signedUp: Boolean = false;
    showStatus: Boolean = false;
    showDetails: Boolean = false;
    guestUser: Boolean = false;
    registering: Boolean = false;
    isGroupAdmin: boolean = false;
    orgId: string = null;

    gender = GENDER_RESTRICTION;
    vRestriction = VOLUNTEER_RESTRICTION;
    eStatus = EVENT_STATUS;
    sdRestriction = SAMEDAY_RESTRICTION;
    aRestriction = AGE_RESTRICTION;
    nSchedule = NOTIFICATION_SCHEDULE;
    nOptions = NOTIFICATION_OPTIONS;
    oRestriction = ORG_RESTRICTION;
    deregisterResult: any;

    public myPreferencesObservable;
    public myPreferences;

    constructor(params: NavParams,
        private volunteerEventsService: VolunteerEventsService,
        private userServices: UserServices,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastController: ToastController,
        public appCtrl: App,
        public navController: NavController,
        private signupAssistant: SignupAssistant,
        private ev: Events,
        private navCtrl: NavController) {
        this.viewCtrl = viewCtrl;
        this.eventId = params.get('id');
        this.signedUp = params.get('registered');
        this.guestUser = params.get('guestUser');
        this.myPreferences = params.get('preference_data');
        this.isGroupAdmin = params.get('isGroupAdmin');
        this.orgId = params.get('orgId');
    }

    ngOnInit() {
        this.registering = false;
        this.loadDetails();
        this.signupAssistant.setGuestSignup(false);
        if (this.userServices.user.id && !this.myPreferences) {
            this.userServices.getMyPreferences().subscribe(data => this.myPreferences = data);
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

    loadDetails() {

        if (this.userServices.isAdmin()) {
            //check account for TSA admin status
            this.getAdminEventDetails(this.eventId);
            //if they have admin status load admin view of events
        }
        else {
            this.getEventDetails(this.eventId);
        }
        if (this.signedUp) {
            this.getMyEvent(this.eventId);
        }
    }

    get signUpStatusText():string {
        if(this.signedUp && this.userServices.user.id && this.myEvent.organization_name) {
            return "Signed Up as group member of " + this.myEvent.organization_name + '/' + 
                this.myEvent.organization_group;
        }
        else if(this.signedUp && this.userServices.user.id) {
            return "Signed Up";
        }
        return "Not Signed Up";
    }

    youAreNotEligible() {
        let confirm = this.alertCtrl.create({
            title: '',
            cssClass: 'alertReminder',
            message: 'You are not eligible for this event sign up',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                    }
                }
            ]
        });
        confirm.present();
    }

    getAdminEventDetails(id) {
        this.volunteerEventsService
            .getAdminEventDetails(id).subscribe(
            (event) => {
                this.eventDetail = event;
            },
            (err) => {
                console.log(err);
            },
            () => {}
            );
    }

    getMyEvent(id) {
        this.volunteerEventsService
            .getMyEvent(id).subscribe(
                (data) => {
                    this.myEvent = data;
                },
                (err) => {
                    console.error('getMyEvent error: ' + err);
                }
            );
    }

    getEventDetails(id) {
        this.volunteerEventsService
            .getVolunteerEventDetails(id).subscribe(
            (event) => {
                this.eventDetail = event;
            },
            (err) => {
                console.error('getEventDetails error: ' + err);
            }
        );
    }

    unregisteredUserPopover() {
        let confirm = this.alertCtrl.create({
            title: '',
            cssClass: 'alertReminder',
            message: 'Only registered users can sign up for events.',
            buttons: [
                {
                    text: 'Register',
                    handler: () => {
                        this.signupAssistant.setCurrentEventId(this.eventId);
                        this.signupAssistant.setGuestSignup(true);
                        this.appCtrl.getRootNav().push(RegisterLoginPage);
                        this.viewCtrl.dismiss();
                    }
                },
                {
                    text: 'Login',
                    handler: () => {
                        this.signupAssistant.setCurrentEventId(this.eventId);
                        this.signupAssistant.setGuestSignup(true);
                        this.appCtrl.getRootNav().push(LoginPage);
                        this.viewCtrl.dismiss();
                    }
                }
            ]
        });
        confirm.present();
    }

    signupEventRegistration(eventData) {
        if(!this.userServices.user.id) {
            this.unregisteredUserPopover();
            return;
        }

        let eventType = eventData.org_restriction;
        let eventId = eventData.id;
        let admin = this.myPreferences && this.myPreferences.organications && this.myPreferences.organizations.some( org => org.role == 1 || org.role == 2);
        
        if (eventType == 1) {

            //TODO: Event only Logic
            //IF USER is not The leader of any group

            if (!admin) {
                let confirm = this.alertCtrl.create({
                    title: '',
                    cssClass: 'alertReminder',
                    message: 'Group event sign-up is only available to Group Admins.',
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
                this.eventSignupModal(eventData, admin);
            }

        } else if (eventType == 0) {
            this.eventSignupModal(eventData, admin);
        } else {
            //Continue with existing logic
            this.signupAssistant.setCurrentEventId(eventId);
            this.volunteerEventsService
                .checkMyEvents(eventId).subscribe(
                res => {
                    this.signupAssistant.signupEventRegistration();
                },
                err => {
                    console.log(err);
                    if (err._body.indexOf("You are already registered for this event.") > 0) {
                        let confirm = this.alertCtrl.create({
                            title: 'Event Notice',
                            cssClass: 'alertReminder',
                            message: "You are already registered for this event.",
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
                    }                     
                    else if (err._body.indexOf("Event registration is full") > 0) {
                        let confirm = this.alertCtrl.create({
                            title: 'Event Notice',
                            cssClass: 'alertReminder',
                            message: 'Event Registration is full. We encourage you to search for other similar events.',
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
                            title: 'Event Notice',
                            cssClass: 'alertReminder',
                            message: 'You have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the My Profile page?',
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
                                        this.navController.push(RegisterIndividualProfilePage, { errorResponse: err });
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                });

        }
    }

    eventSignupModal(event_data, is_admin) {

        let eventsignupPopup = this.modalCtrl.create(EventSignupModal, {
            "event_data": event_data,
            "is_admin": is_admin,
        });

        eventsignupPopup.present(/*{ev}*/);
        eventsignupPopup.onDidDismiss(data => {
            this.volunteerEventsService.loadMyEvents();
            if (data == true) {
                this.dismiss();
            }
        });
    }


    signup(id, noti_sched, overlap: boolean) {
        this.volunteerEventsService
            .eventRegisterAndSetReminder(id, noti_sched, 1, overlap).subscribe(
            event => {

                this.presentToast("Event sign-up successful.");
                this.signedUp = true;
            },
            err => {
                if (err._body.indexOf("overlaps") > 0) {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'This event overlaps with another event that you already have scheduled. <br>  <br> Would you like to overlap the event?',
                        buttons: [
                            {
                                text: 'No',
                                handler: () => {
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    this.signup(id, noti_sched, true);
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
                else if (err._body.indexOf("Event registration is full") > 0) {
                    let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'Event registration is full.',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {

                                }
                            }
                        ]
                    });
                    confirm.present();
                }
                else {
                    console.log(err);
                    this.presentToast("Error signing up for event");
                }
            }, () => {
                this.volunteerEventsService.loadMyEvents();
            });
    }
    
    deRegister() {
        const myThis = this;
        this.volunteerEventsService
            .eventDeregister(myThis.eventId).subscribe(
                result => {
                    this.deregisterResult = result;
                    this.presentToast("You are no longer signed up for this event");
                    this.signedUp = false;
                },
                err => {
                    console.log(err);
                    this.presentToast("Error cancelling event registration");
                }, () => {
                    this.volunteerEventsService.loadMyEvents();
                    this.loadDetails();
                });
    }

    deRegisterGroup() {
        const myThis = this;
        this.volunteerEventsService
            .eventDeregisterGroup(myThis.eventId, myThis.orgId).subscribe(
                result => {
                    this.deregisterResult = result;
                    this.presentToast("Your group is longer signed up for this event");
                    this.signedUp = false;
                },
                err => {
                    console.log(err);
                    this.presentToast("Error cancelling group event registration");
                }, () => {
                    this.volunteerEventsService.loadMyEvents();
                    this.loadDetails();
                });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onDidDismiss() {
        this.viewCtrl.onDidDismiss(function (data) {
        });
    }
    cancelEventRegistration(isGroup: boolean = false) {
        const message = (isGroup ? "Are you sure you want to cancel event Registration for the group?" :
                                   "Are you sure you want to cancel this event Registration?");
        let confirm = this.alertCtrl.create({
            title: '',
            cssClass: 'alertReminder',
            message: message,
            buttons: [
                {
                    text: 'No',
                    handler: () => {

                    }
                },
                {
                    text: 'Yes',
                    handler: () => {

                        if(!isGroup) {
                            this.deRegister();
                        }
                        else {
                            this.deRegisterGroup();
                        }
                    }
                }
            ],
            enableBackdropDismiss: false
        });
        confirm.present();
    }
    /***
    Premise: TO redirect temporarily to either a login or registration, and then return
    to events to continue signup flow.
    params: flag -> 0 or 1 representing either login or register
    event_id: numeric Id representing specific event,
    ***
    */
      private handleEventLoginRegister(flag, event_id){
          this.ev.subscribe('user-event-flow', (paramsVar) => {
              // Do stuff with "paramsVar"
              console.log("paramsVar:" + paramsVar);
              //Soso
              this.ev.unsubscribe('user-event-flow'); // unsubscribe this event
          });
          //this.viewCtrl.dismiss();
          let toPage ;
          if(flag === 0){
            toPage = LoginPage;
        }else{
          toPage = RegisterLoginPage;
        }
      this.navCtrl.push(toPage, {
          event_id: event_id,
          fromPage:"eventDetails"
        });
      }
}
