import {Component} from '@angular/core';
import {VolunteerEventsService} from '../../lib/service/volunteer-events-service';
import {HomePage} from '../home/home'
@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

  constructor(public volunteerEventsService: VolunteerEventsService,
              public home: HomePage) {  };

    result: any;

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
}