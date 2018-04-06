import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER } from '../provider/config';
import { Storage } from '@ionic/storage';
import {MY_ORG_CONTACTS_URI} from '../provider/config';
import {GET_MYORG_REG_EVENT_URI} from '../provider/config';
import { NEW_ORGANIZATION_URI } from '../provider/config';
import { MY_ORGANIZATIONS_URI } from '../provider/config';
import { ALL_ORGANIZATIONS_URI, ALL_ORGANIZATIONTYPES_URI } from '../provider/config';
import { MY_PENDING_ORGANIZATIONS_URI } from '../provider/config';
import { ORGANIZATIONCONTACTS_URI } from '../provider/config';
import { GET_ORGREQUESTS_REQUESTED_URI } from '../provider/config';
import { GET_ORGANIZATION_TYPES_URI } from '../provider/config';
import { APPROVE_ORGANIZATION_URI } from '../provider/config';
import { ALL_GROUPS_URI } from '../provider/config';
import { HttpRequest } from '@angular/common/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {UserServices} from '../../lib/service/user';
import { Organization } from '../model/organization';
import { UserProfile } from '../model/user-profile';

@Injectable()
export class OrganizationServices {
	public key:String;
    private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    private approve: any = {
        status: <number>{}        
    };

	constructor(private http:Http, public storage:Storage, private userServices: UserServices) {
            if(this.userServices.user.id) {
                this.key = this.userServices.user.id;
                console.log("using UserServices key!");
            }
            else {
                storage.get('key')
                    .then(key => this.key = key)
                    .catch(err => console.log("couldn't get key for authentication"));
            }
        }

    createOrganization(org : any) : Observable<any>
    {
        return this.http.post(SERVER + NEW_ORGANIZATION_URI, org, this.getOptions())
            .map(res => res.json())
            .catch(this.handleError);
    }
    getOptions() {
		let headers = new Headers();
        headers.append('Authorization', 'Token ' + this.key);
        console.log("Token: " + this.key);
		headers.append('Content-Type', 'application/json;q=0.9');
		headers.append('Accept', 'application/json;q=0.9');
		return new RequestOptions({headers: headers});
    }

    getMyOrganizations()
    {
        return this.http.get(SERVER + MY_ORGANIZATIONS_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyOrganizations'));
    }
    getMyPendingOrganizations()
    {
        return this.http.get(SERVER + MY_PENDING_ORGANIZATIONS_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyPendingOrganizations')); 
    }
    getOrganizationContacts(org_id) {
        return this.http.get(SERVER + ORGANIZATIONCONTACTS_URI + org_id , this.getOptions())
        .map((res : Response) => {
            //console.log("res._body = " + res.toString);
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrganizationContacts'));  
    }

    getOrgRequestsRequested() {
        return this.http.get(SERVER + GET_ORGREQUESTS_REQUESTED_URI, this.getOptions())
        .map((res : Response) => {
            //console.log("res._body = " + res.toString);
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrgRequestsRequested'));  
    }
    getMyPendingOrganizationsDetails(org_id)
    {
        return this.http.get(SERVER + MY_PENDING_ORGANIZATIONS_URI +org_id +'/', this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyPendingOrganizationDetails')); 
    }
    

    approveOrganization(org_id): Observable<any> {
        //let status2 = '{"status": 2}';
        this.approve.status = 2;
        //console.log("status2: " + this.approve);
        //console.log("URL:" + SERVER + APPROVE_ORGANIZATION_URI + org_id+"/");
        return this.http.put(SERVER + APPROVE_ORGANIZATION_URI + org_id+"/", this.approve, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error on approveOrganization'));
    }
    
    getAllOrgNames()
    {
        return this.http.get(SERVER + ALL_ORGANIZATIONS_URI, this.getOptions())
        .map((res : Response) => {
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getAllOrgNames'));  
    }
    private handleError(error: any) {
        let errMsg = error._body;
             console.error(errMsg); // log to console instead
             return Observable.throw(errMsg);
     }

     getOrgContacts(eventId){
         //console.log("EventId:" + eventId)
          return this.http.get(SERVER + MY_ORG_CONTACTS_URI + eventId +"/", this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrgContacts'));
     }

     getOrgTypes(){
         //console.log("EventId:" + eventId)
          return this.http.get(SERVER + GET_ORGANIZATION_TYPES_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrgTypes'));
     }
     putOrganizationRequest (orgid,body) {
        return this.http.put(SERVER + MY_PENDING_ORGANIZATIONS_URI+orgid +"/", JSON.stringify(body),this.getOptions())
        
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on putOrganizationRequest'));  
    }
    putOrgContactsRequest (orgid,body) {
        return this.http.put(SERVER + ORGANIZATIONCONTACTS_URI+orgid +"/", JSON.stringify(body),this.getOptions())
        
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on putOrgContactsRequest'));  
    }
     getOrgRegistrations(org_id, event_id){
         return this.http.get(SERVER + GET_MYORG_REG_EVENT_URI + org_id + "/" + event_id +"/", this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrgRegistrations'));
     }
    
    groupRegisterForEvent(org_id, event_id, members, notification) {
        let data = { "options": { "notification_option": 0 }, "members": [] };
        data.options = { "notification_option": notification };
        //   data.options= {"options":options};

        data.members = members;
        console.log(JSON.stringify(data));
        return this.http.post(SERVER + GET_MYORG_REG_EVENT_URI + org_id + "/" + event_id + "/", data, this.getOptions())
            .map(res => res.json())
            .catch(this.handleError);
    }

     getAllOrganizationTypes()
     {
         return this.http.get(SERVER + ALL_ORGANIZATIONTYPES_URI, this.getOptions())
         .map(res => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error on getAllOrganizationTypes'));
     } 
     
    public createGroup(groupData : any, membersData : any[]) : Observable<any> {
        //format required by API
        let payload = {status: 0, organization: null, members: Array<any>()};
        payload.organization = groupData;
        for(let member of membersData) {
            payload.members.push(member);
        }
        console.log('submission payload:' + JSON.stringify(payload));
        return this.createOrganization(payload);
     }

     public getAllGroups(): Observable<any>
     {
         return this.http.get(SERVER + ALL_GROUPS_URI, this.getOptions())
         .map(res => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error on getAllGroups'));
     } 
     
}


