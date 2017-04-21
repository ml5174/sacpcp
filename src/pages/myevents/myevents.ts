import {Component} from '@angular/core';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from '../../pages/events/eventdetail-modal';
import { EventDetailPopup } from '../../pages/events/eventdetail-popup';
import { ModalController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { HomePage } from '../home/home';
import { AlertController, PopoverController } from 'ionic-angular';
@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

    constructor(public volunteerEventsService: VolunteerEventsService,
        public userServices: UserServices,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        private popoverCtrl: PopoverController,
              public home: HomePage) {  };

    result: any;
    eventDetail: EventDetail;
    deRegister(id){
    this.volunteerEventsService
         .eventDeregister(id).subscribe(
                                result => this.result = result, 
                                 err => {
                                     console.log(err);
                                 }, ()=> {
                                     this.volunteerEventsService.loadMyEvents();
                                     if(this.volunteerEventsService.myEvents.length==1){
                                       this.home.selectedTab="events";
                                     }
                                     
                                 });
    }
    eventDetailModal(id) {

        let eventDetailModal = this.modalCtrl.create(EventDetailModal, {
            "id": id,
            "registered": this.amISignedUp(id)
        });
        eventDetailModal.present();
    }
    eventDetailPopup(id) {
        let eventDetailPopup = this.popoverCtrl.create(EventDetailPopup, {
            "id": id,
            "guestUser": false,
            "registered": this.amISignedUp(id)
        }, { cssClass: 'detail-popover' });

        let ev = {
            target: {
                getBoundingClientRect: () => {
                    return {
                        top: '200'
                    };
                }
            }
        };
        eventDetailPopup.present({ ev });
    }
    amISignedUp(id) {
        //we return true if there is no user logged in, this prevents the ability
        //to sign up for an event 
        if (!this.userServices.user.id) {
            return true;
        }
        for (let i of this.volunteerEventsService.myEvents) {
            if (id == i.event_id) {
                return true;
            }
        }
        return false;
    }
    signup(id, noti_opt, noti_sched) {
        this.volunteerEventsService
            .eventRegisterAndSetReminder(id, noti_opt, noti_sched).subscribe(
            event => {
                console.log("signed up for event " + id);
                //this.presentToast("Event sign-up successful.");
            },
            err => {
                console.log(err);
                //this.presentToast("Error signing up for event");
            }, () => {
                this.volunteerEventsService.loadMyEvents();
            });
    }
    signupEventRegistration(id,toggleevent: any) {
       
        if (toggleevent.checked) {
            this.getEventDetails(id);
                this.signup(id, this.eventDetail.notification_option, this.eventDetail.notification_schedule);
            }
            else
            {
                this.signup(id, 0, 0);
            }        
    }
    getEventDetails(id) {
        this.volunteerEventsService
            .getVolunteerEventDetails(id).subscribe(
            event => this.eventDetail = event,
            err => {
                console.log(err);
            });
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