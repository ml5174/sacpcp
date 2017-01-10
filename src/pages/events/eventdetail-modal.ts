import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserServices } from '../../service/user';
import { EventDetail } from '../../model/event-detail';
import { VolunteerEventsService } from '../../service/volunteer-events-service';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'eventdetail_modal.html'
})

export class EventDetailModal {
    eventId: String;
    eventDetail: EventDetail;

    constructor(params: NavParams,
        private volunteerEventsService: VolunteerEventsService,
        private userServices: UserServices,
        public viewCtrl: ViewController) {

        this.viewCtrl = viewCtrl;
        this.eventId = params.get('id');

    }

    ngOnInit() {

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

    getAdminEventDetails(id){
         this.volunteerEventsService
         .getAdminEventDetails(id).subscribe(
                                event => this.eventDetail = event, 
                                 err => {
                                     console.log(err);
                                 },
                                 () => console.log(this.eventDetail));
    }

    getEventDetails(id){
         this.volunteerEventsService
         .getVolunteerEventDetails(id).subscribe(
                                event => this.eventDetail = event, 
                                 err => {
                                     console.log(err);
                                 },
                                 () => console.log(this.eventDetail[0]));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}