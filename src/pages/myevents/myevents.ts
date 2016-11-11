import {Component} from '@angular/core';
import {VolunteerEvent} from '../../model/volunteer-event';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {EventImage} from '../../model/eventImage';


@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents'
})

export class MyEventsPage{

  constructor(private volunteerEventsService: VolunteerEventsService) {  };
  
}