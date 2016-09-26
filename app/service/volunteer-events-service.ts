import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {VolunteerEvent} from '../model/volunteer-event';
import {GET_EVENTS_URI} from '../provider/config';
import {SERVER} from '../provider/config';

@Injectable()
export class VolunteerEventsService {
    constructor(private http: Http) { 
    }
    private commentsUrl = 'backend-mock/events.json';
    getVolunteerEvents() : Observable<VolunteerEvent[]>{
        return this.http.get(SERVER+GET_EVENTS_URI)
            .map(res => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}