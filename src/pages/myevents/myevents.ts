import {Component} from '@angular/core';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {HomePage} from '../home/home'
@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

  constructor(private volunteerEventsService: VolunteerEventsService,
              private home: HomePage) {  };

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