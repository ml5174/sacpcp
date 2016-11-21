import {Component} from '@angular/core';
import {VolunteerEventsService} from '../../service/volunteer-events-service';

@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

  constructor(private volunteerEventsService: VolunteerEventsService) {  };

    result: any;

    deRegister(id){
    this.volunteerEventsService
         .eventDeregister(id).subscribe(
                                result => this.result = result, 
                                 err => {
                                     console.log(err);
                                 }, ()=> {
                                     this.volunteerEventsService.loadMyEvents()
                                 });
  }
}