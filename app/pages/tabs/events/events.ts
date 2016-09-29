import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEvent} from '../../../model/volunteer-event';
import {VolunteerEventsService} from '../../../service/volunteer-events-service';
import { Observable } from 'rxjs/Observable';
import {LogonPage} from '../../logon/logon';

@Component({
  templateUrl: 'build/pages/tabs/events/events.html',
  providers: [VolunteerEventsService]
})
export class EventsPage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: Array<VolunteerEvent> = [];
  language: string = "english";
  constructor(private navCtrl: NavController,
              private nav: Nav, 
              private volunteerEventsService: VolunteerEventsService
  ) {  }
  ngOnInit(){
    this.getEvents();
  }
  onCancel(event: any) {
    this.search=false;
  }
  getEvents() {
    this.volunteerEventsService
        .getVolunteerEvents().subscribe(
                               events => this.events = events, 
                                err => {
                                    console.log(err);
                                });
  }

  login() {
    this.nav.setRoot(LogonPage);
  }
}
