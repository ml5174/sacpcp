import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {VolunteerEvent} from '../../../service/event/volunteer-event';
import {VolunteerEventsService} from '../../../service/event/volunteer-events-service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'build/pages/tabs/home/home.html',
  providers: [VolunteerEventsService]
})
export class HomePage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: Array<VolunteerEvent> = [];
  constructor(private navCtrl: NavController,
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
  
}
