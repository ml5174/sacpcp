import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, EVENT_STATUS, SAMEDAY_RESTRICTION } from './../../lib/provider/eventConstants';

@Component({
    templateUrl: 'eventdetail_modal.html'
})

export class EventDetailModal {
    eventId: String;
    eventDetail: EventDetail;
    signedUp: Boolean = false;
    showStatus: Boolean = false;
    showDetails: Boolean = false;
    gender = GENDER_RESTRICTION;
    vRestriction = VOLUNTEER_RESTRICTION;
    eStatus = EVENT_STATUS;
    sdRestriction = SAMEDAY_RESTRICTION;
    aRestriction = AGE_RESTRICTION;
    deregisterResult: any;

    constructor(params: NavParams,
        private volunteerEventsService: VolunteerEventsService,
        private userServices: UserServices,
        public viewCtrl: ViewController) {

        this.viewCtrl = viewCtrl;
        this.eventId = params.get('id');
        this.signedUp = params.get('registered');
    }

    ngOnInit() {

        this.loadDetails();

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

    signup(id) {
        this.volunteerEventsService
            .eventRegister(id).subscribe(
            event => console.log("signed up for event " + id),
            err => {
                console.log(err);
            }, () => {
                this.signedUp = true;
                this.volunteerEventsService.loadMyEvents();
                this.loadDetails();
            });
    }
    deRegister(id) {
        this.volunteerEventsService
            .eventDeregister(id).subscribe(
            result => this.deregisterResult = result,
            err => {
                console.log(err);
            }, () => {
                this.signedUp = false;
                this.volunteerEventsService.loadMyEvents();
                this.loadDetails();
            });
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}