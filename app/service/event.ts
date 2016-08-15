import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {
    events: Array<any> = [];
    constructor(private http: Http) { }
    getEvents() {
        this.http.get('http://localhost:8100/backend-mock/events.json')
            .map(res => res.json())
            .subscribe(
            data => this.events.push(data),
            err => this.logError(err),
            () => console.log('got Events')
            )
    }
    logError(err) {
        console.error('There was an error: ' + err);
    }
}