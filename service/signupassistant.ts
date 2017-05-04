import { Injectable } from '@angular/core';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { AlertController, ToastController} from 'ionic-angular';
import { UserServices } from '../../lib/service/user';


@Injectable()
export class SignupAssistant {
    constructor(
    private userServices: UserServices,
    public volunteerEventsService: VolunteerEventsService,
    public alertCtrl: AlertController,
    public toastController: ToastController) {
    }
    private eventDetail: EventDetail;
    private currentEventId;
    public userId;
    private guestSignup: boolean = false;
    

    pushPreviousPage() {

    }

     ngOnInit() {
        this.loadDetails();
    }

    getEventDetails(id) {
        this.volunteerEventsService
            .getVolunteerEventDetails(id).subscribe(
            event => {this.eventDetail = event;
            },
            err => {
                console.log(err);
            });
    }
    setCurrentEventId(param) {
        this.currentEventId = param;
    }
    getCurrentEventId() {
        return this.currentEventId;
    }

    setGuestSignup(param) {
         this.guestSignup = param;
    }
    getGuestSignup() {
        return this.guestSignup;
    }

       presentToast(message: string) {
     let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
     });
     toast.present();
    }

        getAdminEventDetails(id) {
        this.volunteerEventsService
            .getAdminEventDetails(id).subscribe(
            event => this.eventDetail = event,
            err => {
                console.log(err);
            });
    }

       loadDetails() {
        if (this.userServices.isAdmin()) {
            //check account for admin status
            console.log("User is admin");
            this.getAdminEventDetails(this.currentEventId);
            //if they have admin status load admin view of events
        }
        else {
            this.getEventDetails(this.currentEventId);
        }
    }

    signupEventRegistration() {
          console.log('EVENTDETAILS: ' + this.currentEventId);
        this.getEventDetails(this.currentEventId);
      
        if (this.eventDetail.notification_schedule !="0") {
            let confirm = this.alertCtrl.create({
                title: '',
                cssClass: 'alertReminder',
                message: 'Thank you for signing up to volunteer. <br>  <br> Would you like to receive reminders as the event approaches?',
                buttons: [
                    {
                        text: 'No, Thanks',
                        handler: () => {
                            console.log('No, Thanks clicked');
                            this.signup(this.currentEventId, 0, false);
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Yes clicked');
                            this.signup(this.currentEventId, this.eventDetail.notification_schedule, false);
                        }
                    }
                ]
            });
            confirm.present();
        }else {
            this.signup(this.currentEventId, 0, false);
        }
         
    }


  signup(id, noti_sched, overlap: boolean) {
        this.volunteerEventsService
            .eventRegisterAndSetReminder(id, noti_sched, overlap).subscribe(
            event => {
                console.log("signed up for event " + id);
                this.presentToast("Event sign-up successful.");
                //this.signedUp = true;
                 this.setCurrentEventId(undefined);
                 this.setGuestSignup(false);
            },
            err => {
                if (err.status == 400) {
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
                else {
                    console.log(err);
                    this.presentToast("Error signing up for event");
                }
            }, () => {
                this.volunteerEventsService.loadMyEvents();
            });
    }


}