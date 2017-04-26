import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { NOTIFICATION_OPTIONS, NOTIFICATION_SCHEDULE, AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, EVENT_STATUS, SAMEDAY_RESTRICTION } from './../../lib/provider/eventConstants';
import { UserServices } from '../../lib/service/user';
import { VolunteerEvent } from '../../lib/model/volunteer-event';
import { HomePage } from '../../pages/home/home';
import { parseTime } from '../../pipe';
import moment from 'moment';
@Component({
    templateUrl: 'editEventDetail.html'
})
export class EditEventDetailPage {
    public volunteerEvents: Array<VolunteerEvent> = [];
    public eventDetail: EventDetail;
    gender = GENDER_RESTRICTION;
    aRestriction = AGE_RESTRICTION;
    vRestriction = VOLUNTEER_RESTRICTION;
    sdRestriction = SAMEDAY_RESTRICTION;
    nOptions = NOTIFICATION_OPTIONS;
    nSchedule = NOTIFICATION_SCHEDULE;
    signedUp: Boolean = false;
    deregisterResult: any;
    showEditDetails: string = "hidden";
    cancelEditDetails: string = "hidden";
    eventCancellation: any;
    daysLeftUntilStartDate: number;
    showDetails: Boolean = false;
    eStatus = EVENT_STATUS;
    eventDate: any;
    endDateTime: any;
    startDateTime: any;
    showVolunteerDetails: Boolean = false;
    showSpecialInstructions: Boolean = false;
    showContactInformation: Boolean = false;
    contacts: string[];

    constructor(private volunteerEventsService: VolunteerEventsService,
        private userServices: UserServices,
        public nav: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public toastController: ToastController,
        public alertCtrl: AlertController) {

        this.eventDetail = this.navParams.get('eventDetailKey');
        this.contacts = this.navParams.get('contacts');
        this.signedUp = this.navParams.get('signedUp');
        this.viewCtrl = viewCtrl;
        if (this.eventDetail.creation_date) {
            this.daysLeftUntilStartDate = moment(this.eventDetail.creation_date).date();
        }
        if (this.eventDetail.end) {
            this.endDateTime = moment(this.eventDetail.end).hours();//Time
        }
  
    }


    back() {
        this.nav.pop();
    }


    presentToast(message: string) {
        let toast = this.toastController.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    }


    signup(id) {
        this.volunteerEventsService
            .eventRegister(id).subscribe(
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
                this.getAdminEventDetails(id);
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
                this.getAdminEventDetails(id);
                this.volunteerEventsService.loadMyEvents();
            });
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }

    editEventDetailsAdmin(toggle) {
        this.showEditDetails = toggle;
        this.showDetails = false;
        this.showVolunteerDetails = false;
        this.showSpecialInstructions = false;
        this.showContactInformation = false;
    }

    cancelEventDetailsEdit(toggle) {
        this.cancelEditDetails = toggle;
        this.showDetails = true;
        this.showVolunteerDetails = true;
        this.showSpecialInstructions = true;
        this.showContactInformation = true;
    }

    // Update EventDetail
    updateEventDetails(id) {

        // for(var i in this.eventDetail.contacts)
        //   {
        //     console.log(" >>>>>>>>>FN ====>>> "+this.eventDetail.contacts[i]["user_contact"].first_name );
        // }

        this.volunteerEventsService
            .updateEventDetails(this.eventDetail).subscribe(
            result => {
                this.eventDetail = result;
                this.presentToast("Event Detail Updated successful!");

            },
            err => {
                console.log(err);
                this.presentToast("Error in updating Event Details!");
            }, () => {
                this.getAdminEventDetails(id);

            });
    }

    updateContact( selected_owner_id ) {
       console.log("====>>>> " + selected_owner_id);
        var contact = {contacts : [{owner_id: selected_owner_id}]};
        
        this.volunteerEventsService
            .updateContact(this.eventDetail, contact).subscribe(
            result => {
                this.eventDetail = result;
                this.presentToast("Contact added for Event Detail successfully!");

            },
            err => {
                console.log(err);
                this.presentToast("Error in adding Contact for Event Details!");
            }, () => {
                this.getAdminEventDetails(this.eventDetail.id);

            });
    }

    getAdminEventDetails(id) {
        this.volunteerEventsService
            .getAdminEventDetails(id).
            subscribe(
            event => { this.eventDetail = event, this.assignEventDetail(this.eventDetail) },
            err => {
                console.log(err);
            });

    }

    assignEventDetail(ed: EventDetail) {
        this.eventDetail = ed;

    }

    cancelEvent(id) {

        this.volunteerEventsService
            .cancelEvent(id).subscribe(
            result => {
                this.eventCancellation = result;
                //this.presentToast("Event is successfully cancelled");
                this.eventCancelledConfirmation();
            },
            err => {
                console.log(err);
                this.presentToast("Error cancelling event ");
            }, () => {
                this.nav.push(HomePage, { tab: 'events' });
            });

    }

    backToEventList(date: String) {
        this.nav.push(HomePage, { tab: 'events' });
    }


    confirmCancelEvent(event_Id) {
        let confirm = this.alertCtrl.create({
            //title: 'Use this lightsaber?',
            message: 'Are you sure you want to cancel this oppurtunity?',
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
                        this.cancelEvent(event_Id);

                    }
                }
            ]
        });
        confirm.present();
    }

    eventCancelledConfirmation() {
        let alert = this.alertCtrl.create({
            //title: 'New Friend!',
            message: 'Opportunity successfully cancelled and email notification is sent to registered users',
            buttons: ['OK']
        });
        alert.present();
    }
}