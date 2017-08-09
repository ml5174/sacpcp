import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController} from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { SignupAssistant } from '../../lib/service/signupassistant';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { AlertController, NavController, App} from 'ionic-angular';
import { NOTIFICATION_SCHEDULE, NOTIFICATION_OPTIONS, AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, EVENT_STATUS, SAMEDAY_RESTRICTION } from './../../lib/provider/eventConstants';
import { LoginPage } from '../login/login';
import { RegisterLoginPage } from '../register-login/register-login';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
@Component({
    templateUrl: 'eventdetail_modal.html',
})

export class EventDetailModal {
    eventId: String;
    eventDetail: EventDetail;
    signedUp: Boolean = false;
    showStatus: Boolean = false;
    showDetails: Boolean = false;
    guestUser: Boolean = false;
    registering: Boolean = false;

    gender = GENDER_RESTRICTION;
    vRestriction = VOLUNTEER_RESTRICTION;
    eStatus = EVENT_STATUS;
    sdRestriction = SAMEDAY_RESTRICTION;
    aRestriction = AGE_RESTRICTION;
    nSchedule = NOTIFICATION_SCHEDULE;
    nOptions = NOTIFICATION_OPTIONS;

    deregisterResult: any;

    constructor(params: NavParams,
        private volunteerEventsService: VolunteerEventsService,
        private userServices: UserServices,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public toastController: ToastController,
        public appCtrl: App,
        public navController: NavController,
        private signupAssistant: SignupAssistant) {
        this.viewCtrl = viewCtrl;
        this.eventId = params.get('id');
        this.signedUp = params.get('registered');
        this.guestUser = params.get('guestUser');
    }

    ngOnInit() {
       this.registering = false;
        this.loadDetails();
        this.signupAssistant.setGuestSignup(false);
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
            //check account for admin status
            console.log("User is admin");
            this.getAdminEventDetails(this.eventId);
            //if they have admin status load admin view of events
        }
        else {
            this.getEventDetails(this.eventId);
        }
    }
    getAdminEventDetails(id) {
        this.volunteerEventsService
            .getAdminEventDetails(id).subscribe(
            event => this.eventDetail = event,
            err => {
                console.log(err);
            });
    }

    getEventDetails(id) {
        this.volunteerEventsService
            .getVolunteerEventDetails(id).subscribe(
            event => this.eventDetail = event,
            err => {
                console.log(err);
            });
    }

    unregisteredUserPopover(){
             let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'Only registered users can sign up for events.', 
                        buttons:[
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
                              text:'Login',
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
    signupEventRegistration(id) {
        if(!this.userServices.user.id){
            this.unregisteredUserPopover();
        } else{
            this.signupAssistant.setCurrentEventId(id);
            this.volunteerEventsService
                .checkMyEvents(id).subscribe(
                res => {  
                    this.signupAssistant.signupEventRegistration();
                    this.signedUp = true;
                },
                err => {
                    console.log(err);
                    if(err._body.indexOf("Event registration is full") > 0){
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
                    }else{
                        let confirm = this.alertCtrl.create({
                                title: '',
                                cssClass: 'alertReminder',
                                message: 'You Have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the about me page?',
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
                                            this.viewCtrl.dismiss();
                                            this.appCtrl.getRootNav().push(RegisterIndividualProfilePage,{errorResponse:err});
                                        }
                                    }
                                ]
                        });
                        confirm.present();
                    }
                });
        }   
    }


  signup(id, noti_sched, overlap: boolean) {
        this.volunteerEventsService
            .eventRegisterAndSetReminder(id, noti_sched,1, overlap).subscribe(
            event => {
                console.log("signed up for event " + id);
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
                                    console.log('No, clicked');
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    console.log('Yes clicked');
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
                                    console.log('Ok, clicked');
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
    deRegister(id) {
        this.volunteerEventsService
            .eventDeregister(id).subscribe(
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
    dismiss() {
        this.viewCtrl.dismiss();
    }
    cancelEventRegisteration(id) {
        let confirm = this.alertCtrl.create({
            title: '',
            cssClass: 'alertReminder',
            message: 'Are you sure you want to cancel this event Registration?',
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
                        this.deRegister(id);
                    }
                }
            ],
            enableBackdropDismiss: false
        });
        confirm.present();
    }
}
