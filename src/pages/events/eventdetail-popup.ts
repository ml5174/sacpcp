import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { AlertController } from 'ionic-angular';
import { NOTIFICATION_SCHEDULE, NOTIFICATION_OPTIONS, AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, EVENT_STATUS, SAMEDAY_RESTRICTION } from './../../lib/provider/eventConstants';

@Component({
    templateUrl: 'eventdetail-popup.html'
})

export class EventDetailPopup {
    eventId: String;
    eventDetail: EventDetail;
    signedUp: Boolean = false;
    showStatus: Boolean = false;
    showDetails: Boolean = false;
    guestUser: Boolean = false;

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
        public toastController: ToastController) {

        this.viewCtrl = viewCtrl;
        this.eventId = params.get('id');
        this.signedUp = params.get('registered');
        this.guestUser = params.get('guestUser');
    }

    ngOnInit() {

        this.loadDetails();

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

    signupEventRegistration(id, noti_option, noti_schedule) {
        if (noti_schedule != "0") {
            let confirm = this.alertCtrl.create({
                title: '',
                cssClass: 'alertReminder',
                message: 'Thank you for signing up to volunteer. <br>  <br> Would you like to receive reminders as the event approaches?',
                buttons: [
                    {
                        text: 'No, Thanks',
                        handler: () => {
                            console.log('No, Thanks clicked');
                            this.signup(id, 0, 0);
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Yes clicked');
                            this.signup(id, noti_option, noti_schedule);
                        }
                    }
                ]
            });
            confirm.present();
        }
        else {
            this.signup(id, 0, 0);
        }
    }
    signup(id, noti_opt, noti_sched) {
        this.volunteerEventsService
            .eventRegisterAndSetReminder(id, noti_opt, noti_sched).subscribe(
            event => {
                console.log("signed up for event " + id);
                this.presentToast("Event sign-up successful.");
            },
            err => {
                console.log(err);
                this.presentToast("Error signing up for event");
            }, () => {
                this.signedUp = true;
                this.volunteerEventsService.loadMyEvents();
                this.loadDetails();
            });
    }
    deRegister(id) {
        this.volunteerEventsService
            .eventDeregister(id).subscribe(
            result => {
                       this.deregisterResult = result;
                       this.presentToast("You are no longer signed up for this event");                     
            },
            err => {
                console.log(err);
                this.presentToast("Error cancelling event registration");                
            }, () => {
                this.signedUp = false;
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
            ]
        });
        confirm.present();
    }
}
