import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { VolunteerEvent } from '../model/volunteer-event';
import { MyEvent } from '../model/myEvent';
import { EventImage } from '../model/eventImage';
import { EventDetail } from '../model/event-detail';
import { GET_EVENTS_URI } from '../provider/config';
import { GET_EVENT_DETAILS_URI } from '../provider/config';
import { GET_ADMIN_EVENTS_URI } from '../provider/config';
import { GET_ADMIN_EVENT_DETAILS_URI } from '../provider/config';
import { EVENT_CANCEL_URI } from '../provider/config';
import { GET_MYEVENTS_URI } from '../provider/config';
import { GET_EVENT_IMAGE_URI } from '../provider/config';
import { EVENT_SIGNUP_URI } from '../provider/config';
import { SERVER } from '../provider/config';
import { UserServices } from '../service/user';
import { GET_EVENTS_REPORT_URI } from '../provider/config';
import { EVENT_CATEGORIES_URI } from '../provider/config';
import { CHECK_MY_EVENTS_URI } from '../provider/config';


@Injectable()
export class VolunteerEventsService {

    myEvents: Array<MyEvent> = [];
    image: Array<EventImage>;
    private event: any = {
        event_id: <string>{},
        notification_schedule: <number>{},
        overlap_override: <boolean>{},
        notification_option: <number>{}
    };
    private updateEvent: any = {
        event_id: <string>{},
        notification_schedule: <number>{}
    };
    constructor(private http: Http,
        private userServices: UserServices) {
    }
    getEventCategories() {
        return this.http.get(SERVER + EVENT_CATEGORIES_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getEventsReport(body) {
        // TODO: fix this GET_EVENTS_REPORT_URI to use local timezone offset
        return this.http.get(SERVER + GET_EVENTS_REPORT_URI + '?timeMin=' + body.start + 'T06:00:00.000Z&timeMax=' + body.end + 'T06:00:00.000Z', this.getOptionsForReport())
            .map(res => res.text())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    //private commentsUrl = 'backend-mock/events.json';
    clearEvents() {
        console.log("erase myevents was called");
        this.myEvents.length = 0;
    }
    getVolunteerEvents(): Observable<VolunteerEvent[]> {
        return this.http.get(SERVER + GET_EVENTS_URI)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getVolunteerEventDetails(eventId: string): Observable<EventDetail> {
        return this.http.get(SERVER + GET_EVENT_DETAILS_URI + eventId + "/", this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getAdminEvents(): Observable<VolunteerEvent[]> {
        return this.http.get(SERVER + GET_ADMIN_EVENTS_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getAdminEventDetails(eventId: string): Observable<EventDetail> {
        return this.http.get(SERVER + GET_ADMIN_EVENT_DETAILS_URI + eventId + "/", this.getOptions())
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
    eventRegisterAndSetReminder(eventId: number, notification_sched: number, notification_opt: number, overlap_override: boolean): Observable<any> {
        this.event.event_id = eventId;
        this.event.overlap_override = overlap_override;
        this.event.notification_schedule = notification_sched;
        this.event.notification_option = 1;
        return this.http.post(SERVER + EVENT_SIGNUP_URI, this.event, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateEventReminder(eventId: number, notification_sched: number): Observable<any> {
        this.updateEvent.event_id = eventId;
        this.updateEvent.notification_schedule = notification_sched;
        return this.http.put(SERVER + EVENT_SIGNUP_URI + eventId + "/", this.updateEvent, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    eventRegister(eventId: string): Observable<any> {
        this.event.event_id = eventId;
        return this.http.post(SERVER + EVENT_SIGNUP_URI, this.event, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    eventDeregister(eventId: string): Observable<any> {
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
    loadMyEvents() {
        if (this.userServices.user.id) {
            this.getMyEvents(this.userServices.user.id).subscribe(
                myEvents => this.myEvents = myEvents,
                err => {
                    console.log(err);
                })
        };
    }


    //Update EventDetails --
    updateEventDetails(eventDetail: EventDetail): Observable<any> {
        return this.http.put(SERVER + GET_ADMIN_EVENT_DETAILS_URI + eventDetail.id + "/", eventDetail, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    //Cancel Event --
    cancelEvent(eventId: string): Observable<any> {
        return this.http.delete(SERVER + EVENT_CANCEL_URI + eventId + "/", this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    getOptions() {
        let headers = new Headers();
        if (this.userServices) if (this.userServices.user.id) headers.append('Authorization', 'Token ' + this.userServices.user.id);
        headers.append('Content-Type', 'application/json;q=0.9');
        headers.append('Accept', 'application/json;q=0.9');
        return new RequestOptions({ headers: headers });
    }
    getOptionsForReport() {
        let headers = new Headers();
        if (this.userServices) if (this.userServices.user.id) headers.append('Authorization', 'Token ' + this.userServices.user.id);
        headers.append('Content-Type', 'application/json;q=0.9');
        headers.append('Accept', 'application/json, text/csv;q=0.9');
        return new RequestOptions({ headers: headers });
    }
/*
    checkMyEvents(eventId: string): Observable<any> {
        this.event.event_id = eventId;
        return this.http.post(SERVER + CHECK_MY_EVENTS_URI, this.event, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
*/
      setNotificationSchedule(param){
        this.event.notification_schedule = param;
    }

    setNotificationOption(param){
        this.event.notification_option = param;
    }

    setCurrentEventId(param){
        this.event.event_id = param;
    }

    checkMyEventsNew(eventId: string): Observable<any> {
        this.event.event_id = eventId;
        this.setNotificationOption(0);
        this.setNotificationSchedule(0);
        return this.http.post(SERVER + CHECK_MY_EVENTS_URI, this.event, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
        checkMyEvents(eventId: string): Observable<any>{
            this.event.event_id = eventId; 
            this.event.notification_schedule = 0;
            this.event.overlap_override = true;
            this.event.notification_option = 0;
            console.log("event:" + JSON.stringify(this.event));
            return this.http.post(SERVER + CHECK_MY_EVENTS_URI,this.event, this.getOptions())
                .map(res => res.json())
                .catch((error: any) => Observable.throw(error || 'Server error'));
        }

}