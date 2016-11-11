import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { VolunteerEvent } from '../model/volunteer-event';
import { EventImage } from '../model/eventImage';
import { GET_EVENTS_URI } from '../provider/config';
import { GET_MYEVENTS_URI } from '../provider/config';
import { GET_EVENT_IMAGE_URI } from '../provider/config';
import { SERVER } from '../provider/config';

@Injectable()
export class VolunteerEventsService {
    constructor(private http: Http) {
    }
    //private commentsUrl = 'backend-mock/events.json';

    getVolunteerEvents(): Observable<VolunteerEvent[]> {
        return this.http.get(SERVER + GET_EVENTS_URI)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
        getVolunteerEventsMaxTime(maxTime: string): Observable<VolunteerEvent[]> {
         return this.http.get(SERVER + GET_EVENTS_URI + "?timeMax=" + maxTime)
             .map(res => res.json())
             .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
     }
     getVolunteerEventsMinTime(minTime: string): Observable<VolunteerEvent[]> {
         return this.http.get(SERVER + GET_EVENTS_URI + "?timeMin=" + minTime)
             .map(res => res.json())
             .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
     }
     getVolunteerEventsTimeRange(minTime: Date, maxTime: Date): Observable<VolunteerEvent[]> {
         return this.http.get(SERVER + GET_EVENTS_URI + "?timeMin=" + minTime + "&timeMax=" + maxTime)
             .map(res => res.json())
             .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
     }
    getMyEvents(token: number): Observable<VolunteerEvent[]> {
        let header = new Headers();
        header.append('Authorization', 'Token ' + token);
        let requestoption = new RequestOptions({ headers: header });
        return this.http.get(SERVER + GET_MYEVENTS_URI, requestoption)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getEventImage(eventID: number): Observable<EventImage[]> {
        return this.http.get(SERVER + GET_EVENT_IMAGE_URI + eventID + "/")
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}