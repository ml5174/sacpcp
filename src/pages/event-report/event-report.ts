import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { VolunteerEvent } from '../../lib/model/volunteer-event';


@Component({
  templateUrl: 'event-report.html'
})

export class EventReportPage {
  public events: Array<VolunteerEvent> = [];
  public searchedEvents: Array<VolunteerEvent> = [];

  constructor(public volunteerEventsService: VolunteerEventsService, public navCtrl: NavController, public navParams: NavParams) {
  }

  getEventsTimeRange(minTime, maxTime){
    this.volunteerEventsService
        .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
        events => { this.events = events; },
        err => { let x = err; console.log(x); },
        () => {this.searchedEvents = this.events; console.log(this.searchedEvents)});
  }
}

