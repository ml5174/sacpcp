import {Component} from '@angular/core';
import {VolunteerEventsService} from '../../lib/service/volunteer-events-service';
import {HomePage} from '../home/home'
@Component({
    templateUrl: 'myevents.html',
    selector: 'myevents'
})

export class MyEventsPage{

    constructor(public home: HomePage) {  };

    result: any;
}