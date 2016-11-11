import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { VolunteerEvent } from '../model/volunteer-event';
import { EventImage } from '../model/eventImage';
import { GET_EVENTS_URI } from '../provider/config';
import { GET_MYEVENTS_URI } from '../provider/config';
import { GET_EVENT_IMAGE_URI } from '../provider/config';
import { SERVER } from '../provider/config';
import { UserServices } from '../service/user';

@Injectable()
export class VolunteerEventsService {

    myEvents: Array<VolunteerEvent> = [];
    image: Array<EventImage>;

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
    loadMyEvents(){
     if(this.userServices.user.id){
         console.log("calling myevents with Token: " + this.userServices.user.id)
         this.getMyEvents(this.userServices.user.id).subscribe(
                                myEvents => this.myEvents = myEvents, 
                                 err => {
                                     console.log(err);
                                 })};
  }

    populateSearchedEvents(ev: VolunteerEvent[]){
    this.myEvents = ev;
    for (let event of this.myEvents) {
     this.getEventImage(event.id).subscribe(
                               image => {this.image = image;
                                         event.image = this.image;
                                         if(this.image.length==0){
                                            this.image[0] = new EventImage();
                                            event.image = this.image;};
                                        }, 
                                err => {
                                    console.log(err);
                                });
    }
  }
}