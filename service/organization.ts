import { Injectable, group } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { SERVER, UPDATE_ORGANIZATION_ADMIN_URI, UPDATE_ORGANIZATION_URI } from '../provider/config';
import { Storage } from '@ionic/storage';
import {MY_ORG_CONTACTS_URI} from '../provider/config';
import {GET_MYORG_REG_EVENT_URI} from '../provider/config';
import { NEW_ORGANIZATION_URI } from '../provider/config';
import { MY_ORGANIZATIONS_URI } from '../provider/config';
import { ALL_ORGANIZATIONS_URI, ALL_ORGANIZATIONTYPES_URI } from '../provider/config';
import { MY_PENDING_ORGANIZATIONS_URI } from '../provider/config';
import { ORGANIZATIONCONTACTS_URI } from '../provider/config';
import {ORGANIZATIONCONTACTS_ADMIN_URI } from '../provider/config';
import { GET_ORGREQUESTS_REQUESTED_ADMIN_URI } from '../provider/config';
import { GET_ORGANIZATION_TYPES_URI } from '../provider/config';
import { APPROVE_ORGANIZATION_URI } from '../provider/config';
import { ALL_GROUPS_URI } from '../provider/config';
import { ALL_GROUPS_ADMIN_URI } from '../provider/config';
import { HttpRequest } from '@angular/common/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {UserServices} from '../../lib/service/user';
import { Organization } from '../model/organization';
import { UserProfile } from '../model/user-profile';
import { race } from 'rxjs/operator/race';

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
            }
            else {
                storage.get('key')
                    .then(key => this.key = key)
                    .catch(err => console.log("couldn't get key for authentication"));
            }
        }

    createOrganization(org : any) : Observable<any>
    {
        console.log("New Org Request: " + org);
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
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyOrganizations'));
    }

    getMyOrganizationsList():Observable<any> {
        let orgServ = this;
        let observable = Observable.create(function(observer){
            let requests = orgServ.getMyOrganizations();
            try {
                requests.subscribe({
                    next: reqArray => {
                        let orgCount = 0;
                        for(let r of reqArray) {
                            r.approval_status = 2;
                            observer.next(r);
                            orgCount++;
                        }
                        console.log("getMyOrganizationsList orgCount: " + orgCount);
                        observer.complete();
                    }
                });
            }
            catch(err) {
                observer.error("getMyOrganizationsList(): Could not connect to database.");
            }
        });
        return observable;
    }

    getMyOrgRequests()
    {
        return this.http.get(SERVER + MY_PENDING_ORGANIZATIONS_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyOrgRequests')); 
    }

    getMyOrgRequestsList(): Observable<any> {
        let orgServ = this;
        let observable = Observable.create(function(observer){
            let requests = orgServ.getMyOrgRequests();
            try {
                requests.subscribe({
                    next: reqArray => {
                        for(let r of reqArray) {
                            observer.next(r);
                        }
                        observer.complete();
                    }
                });

            }
            catch(err) {
                observer.error("getMyOrgRequestsList(): Could not connect to database.");
            }
        });
        return observable;
    }


/**
 *   Returns an Observable<any> of the organizations this user has requested (not the request itself but the contained organization)
 * @param pendingOnly 
 */
    getMyOrgsFromOrgRequestsList(pendingOnly: boolean = true): Observable<any> {
        let orgServ = this;
        let observable = Observable.create(function(observer){
            let requests = orgServ.getMyOrgRequests();
            let orgCount = 0;
            try {
                requests.subscribe({
                    next: reqArray => {
                        for(let r of reqArray) {
                            if(r.status == 1 || !pendingOnly) {
                                r.organization.approval_status = 1; // adding this field so group-profile can use the correct get for the group
                                r.organization.request_id = r.id;
                                observer.next(r.organization);
                                orgCount++;
                            }
                        }
                        console.log("getMyOrgsFromOrgRequestsList orgCount: " + orgCount);
                        observer.complete();
                    }
                });
            }
            catch(err) {
                observer.error("getMyOrgsFromOrgRequestsList(): Could not connect to database.");
            }
        });
        return observable;
    }


    getOrganizationContacts(org_id: any, useAdmin: boolean = false): Observable<any> {
        let uri = (useAdmin ? ORGANIZATIONCONTACTS_ADMIN_URI : ORGANIZATIONCONTACTS_URI);
        return this.http.get(SERVER + uri + org_id + "/", this.getOptions())
        .map((res : Response) => {
            let response = res.json();
            response.organization.approval_status = 1;
            return response;
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrganizationContacts'));  
    }

    getOrgRequestsRequestedTsaAdmin(): Observable<any> {
        return this.http.get(SERVER + GET_ORGREQUESTS_REQUESTED_ADMIN_URI, this.getOptions())
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getOrgRequestsRequested'));  
    }

    getOrgRequestsRequestedTsaAdminList(): Observable<any> {
        let orgServ = this;
        let observable = Observable.create(function(observer){
            let requests = orgServ.getOrgRequestsRequestedTsaAdmin();
            try {
                requests.subscribe({
                    next: reqArray => {
                        for(let r of reqArray) {
                            r.organization.approval_status = 1;
                            r.organization.request_id = r.id;
                            observer.next(r.organization);
                        }
                        observer.complete();
                    }
                });
            }
            catch(err){
                observer.error("getOrgRequestsRequestedList(): Could not connect to database.");
            }
        });
        return observable;
    }

    getOrgRequestForOrg(org_id: any): Observable<any> {
        return this.getMyOrgRequestsList().find(r => r.organization.id == org_id);
    }
/**
 * 
 * @param org_id this is the org_id, not the request_id
 */
    getMyPendingOrganizationDetails(org_id): Observable<any>
    {
        let orgServ = this;
        return orgServ.getOrgRequestForOrg(org_id)
        .map(res => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on getMyPendingOrganizationDetails')); 
    }
    

    approveOrganization(org_id): Observable<any> {
        this.approve.status = 2;
        
        return this.http.put(SERVER + APPROVE_ORGANIZATION_URI + org_id+"/", this.approve, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error on approveOrganization'));
    }

    administerOrganization(org_id, action: number): Observable<any> {
        let adminAction = {status: action};  //approve:2 or decline:3
        
        return this.http.put(SERVER + APPROVE_ORGANIZATION_URI + org_id+"/", adminAction, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error on administerOrganization'));
    }

    getPendingOrgRequests(): Observable<any> {
        let orgServ = this;
        let observable = Observable.create(function(observer){
            let requests = orgServ.getOrgRequestsRequestedTsaAdmin();
            try {
                requests.subscribe({
                    next: reqArray => {
                        for(let r of reqArray) {
                            observer.next(r);
                        }
                        observer.complete();
                    }
                });
            }
            catch(err) {
                observer.error("getPengingOrgRequests: Could not connect to database.");
            }
        });
        return observable;
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
        return this.http.put(SERVER + MY_PENDING_ORGANIZATIONS_URI + orgid +"/", JSON.stringify(body), this.getOptions())
        
        .catch((error: any) => Observable.throw(error.json().error || 'Server error on putOrganizationRequest'));  
    }
    putOrgContactsRequest (orgid,body, useAdmin: boolean = false) {
        let uri = (useAdmin ? ORGANIZATIONCONTACTS_ADMIN_URI : ORGANIZATIONCONTACTS_URI);
        console.log("url: " + SERVER + uri + orgid +"/; data: " + JSON.stringify(body));
        return this.http.put(SERVER + uri + orgid +"/", JSON.stringify(body),this.getOptions())
        .map(res => res.json())        
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
     public getAllGroupsForAdmin(): Observable<any>
     {
         return this.http.get(SERVER + ALL_GROUPS_ADMIN_URI, this.getOptions())
         .map(res => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error on getAllGroupsForAdmin'));
     }
     
     public updateOrganization(id: number, payload: any, admin: boolean = false): Observable<any> {
         let uri = admin ? UPDATE_ORGANIZATION_ADMIN_URI : UPDATE_ORGANIZATION_URI;
        return this.http.patch(SERVER + uri + id + "/", payload, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error on updateOrganization'));
     }
     
}


