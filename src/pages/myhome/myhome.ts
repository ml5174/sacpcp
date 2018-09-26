import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EventPage} from '../events/events';
import { Subscription } from 'rxjs/Rx';
import {VolunteerEventsService} from '../../lib/service/volunteer-events-service';
import { UserServices } from '../../lib/service/user';

@Component({
  selector: 'page-myhome',
  templateUrl: 'myhome.html',
})
export class MyhomePage {
  @ViewChild(EventPage)
  public eventPage: EventPage;

  selectedTab: string = "myevents";
  language: string = "en";
  subscription: Subscription;
  
  constructor(public navCtrl: NavController,
              public params: NavParams, 
              public volunteerEventsService: VolunteerEventsService,
              public userServices: UserServices
  ) { 
    this.volunteerEventsService.loadMyEvents();
    if (params.get('tab')) {
      this.selectedTab=params.get('tab');
    }
  }
  ngOnDestroy() {
  }
  doInfinite(infiniteScroll) {
    if (this.selectedTab == "events") {
      this.eventPage.doInfinite(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

}
