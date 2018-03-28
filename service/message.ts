import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER } from '../provider/config';
import { Storage } from '@ionic/storage';
import { SEND_MESSAGE_TO_EVENT_VOLUNTEERS_URI, SEND_MESSAGE_TO_ORGANIZATION_URI, 
	SEND_MESSAGE_TO_USERS_LIST_URI } from '../provider/config';
import { UserServices } from './user';

@Injectable()
export class MessageServices {
	public key:String;

	constructor(private http:Http, public storage:Storage,
	private userServices: UserServices) {
		if(this.userServices.user.id) {
			this.key = this.userServices.user.id;
		}
		else {
			storage.get('key')
				.then(key => this.key = key)
				.catch(err => console.log("couldn't get key for authentication"));
		}
	}

    public sendMessageToEvent(event_id,body) {
        return this.http.post(SERVER + SEND_MESSAGE_TO_EVENT_VOLUNTEERS_URI + event_id + '/', body, this.getOptions())
                        .map(res => res.json())
                        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

	public sendMessageToUsersList(body) {
		
		return this.http.post(SERVER + SEND_MESSAGE_TO_USERS_LIST_URI, body, this.getOptions())
				.map(res=> res.json())
				.catch( (err:any) => Observable.throw(err || 'Server error'));
	}

	public sendMessageToGroup(id: string, body: any): Observable<any> {
        return this.http.post(SERVER + SEND_MESSAGE_TO_ORGANIZATION_URI + id + '/', body, this.getOptions())
                        .map(res => res.json())
                        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
		
	}

	private getOptions() {
		let headers = new Headers();
		headers.append('Authorization', 'Token ' + this.key);
		headers.append('Content-Type', 'application/json;q=0.9');
		headers.append('Accept', 'application/json;q=0.9');
		return new RequestOptions({headers: headers});
	}
}