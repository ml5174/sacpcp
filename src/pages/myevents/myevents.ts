import {Component, OnInit} from '@angular/core';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from '../../pages/events/eventdetail-modal';
import { ModalController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { MyhomePage } from '../myhome/myhome';
import { AlertController, PopoverController, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { OrganizationServices } from '../../lib/service/organization';
import { SignupAssistant } from '../../lib/service/signupassistant';


@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage implements OnInit{

    result: any;
    eventDetail: EventDetail;
    public myGroupAdminOrganizations: Array<any> = [];

    constructor(public nav: NavController,
        public volunteerEventsService: VolunteerEventsService,
        public userServices: UserServices,
        public orgServices: OrganizationServices,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public toastController: ToastController,
        private signupAssistant: SignupAssistant,
        private popoverCtrl: PopoverController,
        public home: MyhomePage) {  };

    ngOnInit(): void {
        const pageThis = this;
        this.orgServices.getMyOrganizations().subscribe({
            next: (data) => {
                pageThis.myGroupAdminOrganizations = data.filter(org => org.role == 1);
            }
        });    
    }

    getMyEventOrganizationId(id): string | null {
        let retval = null;
        const volunteerEvent = this.volunteerEventsService.myEvents.find(myEvent => myEvent.event_id == id);
        if (volunteerEvent && volunteerEvent.organization_id) {
            retval = volunteerEvent.organization_id;
        }
        return retval;
    }


    deRegister(id) {
        this.volunteerEventsService
            .eventDeregister(id).subscribe(
                result => this.result = result,
                err => {
                    console.log("deRegister - error: " + err);
                }, () => {
                    this.volunteerEventsService.loadMyEvents();
                    if (this.volunteerEventsService.myEvents.length == 1) {
                        this.home.selectedTab = "events";
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
                this.presentToast("Event reminder updated successfully.");
            },
            err => {
                console.log("eventUpdateReminder - " + err);
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
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.deRegister(id);
                    }
                }
            ]
        });
        confirm.present();
    }

    back() {
        this.nav.pop();
    }

    amIGroupAdmin(id): boolean {
        const volunteerEvent = this.volunteerEventsService.myEvents.find(myEvent => myEvent.event_id == id);
        return volunteerEvent &&
            volunteerEvent.organization_id &&
            this.myGroupAdminOrganizations.find(org => org.organization_id == volunteerEvent.organization_id);
    }

    // NOTE: Requires - the user must be signed up via group and the user is group admin for the group
    cancelGroupEventRegistration(event_id: string): void {
        this.signupAssistant.cancelGroupEventRegistration(event_id, this.getMyEventOrganizationId(event_id));
    }



}
