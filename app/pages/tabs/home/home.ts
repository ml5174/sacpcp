import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventService} from '../../../service/event';

@Component({
  templateUrl: 'build/pages/tabs/home/home.html',
  providers: [EventService]
})
export class HomePage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: any;
  constructor(private navCtrl: NavController,
              private eventService: EventService
  ) {
    eventService.getEvents();
  }
  onCancel(event: any) {
    this.search=false;
  }
  getEvents() {
    return JSON.stringify(this.eventService.events);
  }
  
}
