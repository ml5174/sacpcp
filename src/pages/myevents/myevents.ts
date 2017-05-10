import {Component} from '@angular/core';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from '../../pages/events/eventdetail-modal';
import { EventDetailPopup } from '../../pages/events/eventdetail-popup';
import { ModalController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { HomePage } from '../home/home';
import { AlertController, PopoverController, ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

    constructor(public volunteerEventsService: VolunteerEventsService,
        public userServices: UserServices,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public toastController: ToastController,
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
    presentToast(message: string) {
        let toast = this.toastController.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
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
    eventUpdateReminder(id, noti_sched) {
        this.volunteerEventsService
            .updateEventReminder(id, noti_sched).subscribe(
            event => {
                console.log("Update reminder for event " + id);
                this.presentToast("Event reminder updated successfully.");
            },
            err => {              
                    console.log(err);
                    this.presentToast("Error update reminder for event");                
            }, () => {
                this.volunteerEventsService.loadMyEvents();
            });
    }
    updateEventReminder(id, event_notification_schedule, toggleevent: any) {
       
        if (toggleevent.checked) {
            this.eventUpdateReminder(id, event_notification_schedule);
        }
        else {
            this.eventUpdateReminder(id, 0);
        }        
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