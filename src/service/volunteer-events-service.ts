import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {VolunteerEvent} from '../model/volunteer-event';
import {Locations} from '../model/locations';
import {EventImage} from '../model/eventImage';
import {GET_EVENTS_URI} from '../provider/config';
import {GET_LOCATIONS_URI} from '../provider/config';
import {GET_EVENT_IMAGE_URI} from '../provider/config';
import {SERVER} from '../provider/config';

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
    getLocations(): Observable<Locations[]> {
        return this.http.get(SERVER + GET_LOCATIONS_URI)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getEventImage(eventID: number): Observable<EventImage> {
        return this.http.get(SERVER + GET_EVENT_IMAGE_URI + eventID)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}