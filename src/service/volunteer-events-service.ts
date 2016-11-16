import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { VolunteerEvent } from '../model/volunteer-event';
import { MyEvent } from '../model/myevent';
import { EventImage } from '../model/eventImage';
import { GET_EVENTS_URI } from '../provider/config';
import { GET_MYEVENTS_URI } from '../provider/config';
import { GET_EVENT_IMAGE_URI } from '../provider/config';
import { EVENT_SIGNUP_URI } from '../provider/config';
import { SERVER } from '../provider/config';
import { UserServices } from '../service/user';

@Injectable()
export class VolunteerEventsService {

    myEvents: Array<MyEvent> = [];
    image: Array<EventImage>;
    private event: any = {
        event_id: <string>{}
    };
    constructor(private http: Http,
                private userServices: UserServices) {
    }
    //private commentsUrl = 'backend-mock/events.json';
    clearEvents(){
        console.log("erase myevents was called");
        this.myEvents.length = 0;
    }
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
    eventRegister(eventId: string): Observable<any> {
        this.event.event_id = eventId;
        return this.http.post(SERVER + EVENT_SIGNUP_URI, this.event, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    eventDeregister(eventId :string): Observable<any> {
        return this.http.delete(SERVER + EVENT_SIGNUP_URI + eventId + "/", this.getOptions())
            .map(res => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getMyEvents(token: number): Observable<MyEvent[]> {
        //let header = new Headers();
        //header.append('Authorization', 'Token ' + token);
        //let requestoption = new RequestOptions({ headers: header });
        return this.http.get(SERVER + GET_MYEVENTS_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getEventImage(eventID: string): Observable<EventImage[]> {
        return this.http.get(SERVER + GET_EVENT_IMAGE_URI + eventID + "/")
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    loadMyEvents(){
     if(this.userServices.user.id){
         this.getMyEvents(this.userServices.user.id).subscribe(
                                myEvents => this.myEvents = myEvents, 
                                 err => {
                                     console.log(err);
                                 })};
  }
    getOptions() {
        let headers = new Headers();
        if (this.userServices) if (this.userServices.user.id) headers.append('Authorization', 'Token ' + this.userServices.user.id);
        headers.append('Content-Type', 'application/json;q=0.9');        
        headers.append('Accept', 'application/json;q=0.9');
        return new RequestOptions({ headers: headers });
    }
}