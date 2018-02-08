import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER } from '../provider/config';
import { Storage } from '@ionic/storage';
import { NEW_ORGANIZATION_URI } from '../provider/config';
import { MY_ORGANIZATIONS_URI } from '../provider/config';
import { ALL_ORGANIZATIONS_URI } from '../provider/config';
import { MY_PENDING_ORGANIZATIONS_URI } from '../provider/config';
import { ORGANIZATIONCONTACTS_URI } from '../provider/config';
import { GET_ORGREQUESTS_REQUESTED_URI } from '../provider/config';
import { APPROVE_ORGANIZATION_URI } from '../provider/config';

@Injectable()
export class OrganizationServices {
	public key:String;
    
    private approve: any = {
        status: <number>{}        
    };

	constructor(private http:Http, public storage:Storage) {
		storage.get('key')
			.then(key => this.key = key)
			.catch(err => console.log("couldn't get key for authentication"));
    }
    createOrganization(org)
    {
    return this.http.post(SERVER + NEW_ORGANIZATION_URI, org, this.getOptions())
    .map(res => res.json())
    .catch(this.handleError);
    }
    getOptions() {
		let headers = new Headers();
		headers.append('Authorization', 'Token ' + this.key);
		headers.append('Content-Type', 'application/json;q=0.9');
		headers.append('Accept', 'application/json;q=0.9');
		return new RequestOptions({headers: headers});
    }
    getMyOrganizations()
    {
        return this.http.get(SERVER + MY_ORGANIZATIONS_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getMyPendingOrganizations()
    {
        return this.http.get(SERVER + MY_PENDING_ORGANIZATIONS_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error')); 
    }
    getOrganizationContacts(org_id) {
        return this.http.get(SERVER + ORGANIZATIONCONTACTS_URI + org_id + '/', this.getOptions())
        .map((res : Response) => {
            //console.log("res._body = " + res.toString);
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));  
    }

    getOrgRequestsRequested() {
        return this.http.get(SERVER + GET_ORGREQUESTS_REQUESTED_URI, this.getOptions())
        .map((res : Response) => {
            //console.log("res._body = " + res.toString);
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));  
    }

    approveOrganization(org_id): Observable<any> {
        //let status2 = '{"status": 2}';
        this.approve.status = 2;
        //console.log("status2: " + this.approve);
        //console.log("URL:" + SERVER + APPROVE_ORGANIZATION_URI + org_id+"/");
        return this.http.put(SERVER + APPROVE_ORGANIZATION_URI + org_id+"/", this.approve, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    
    getAllOrgNames()
    {

        return this.http.get(SERVER + ALL_ORGANIZATIONS_URI, this.getOptions())
        .map(res => {
            res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    private handleError(error: any) {
        let errMsg = error._body;
             console.error(errMsg); // log to console instead
             return Observable.throw(errMsg);
     }
}