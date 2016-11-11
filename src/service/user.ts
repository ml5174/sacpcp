import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { LOGIN_URI } from '../provider/config';
import { REGISTER_URI } from '../provider/config';
import { RESET_URI } from '../provider/config';
import { RESET_CONFIRM_URI } from '../provider/config';
import { CHANGE_PASSWORD_URI } from '../provider/config';
import { REGISTER_USER_URI } from '../provider/config';
import { GET_AVAILABLE_PREFERENCES_URI } from '../provider/config';
import { GET_MY_PROFILE_URI } from '../provider/config';
import { GET_MY_PREFERENCES_URI } from '../provider/config';
import { SERVER } from '../provider/config';
import { UPDATE_MY_PROFILE_URI } from '../provider/config';
import { UPDATE_MY_PREFERENCES_URI } from '../provider/config';
import { UserProfile } from '../model/user-profile';

@Injectable()
export class UserServices{
    public user: UserProfile = new UserProfile();
    userIdSource: BehaviorSubject<number> = new BehaviorSubject<number>(this.user.id);
    userIdChange: Observable<number> = this.userIdSource.asObservable().share();
    
    constructor(private http: Http) {
    }
    setId(id: number){
        this.user.id = id;
        this.userIdSource.next(id);

    }

    unsetId(){
        this.setId(null);
    }

    login(body): Observable<any> {
        return this.http.post(SERVER + LOGIN_URI, body, this.getOptions())
            .map(res => {
                this.user.name = body.username;
                this.setId(res.json().key);
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    register(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_URI, body, this.getOptions())
            .map(res => {
                this.setId(res.json().key);
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    registerUser(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_USER_URI, body, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    update(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_USER_URI, body, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    get(): Observable<any> {
        return this.http.get(SERVER + REGISTER_USER_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAvailablePreferences(): Observable<any> {
        return this.http.get(SERVER + GET_AVAILABLE_PREFERENCES_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getMyPreferences(): Observable<any> {
        return this.http.get(SERVER + GET_MY_PREFERENCES_URI, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getMyProfile(): Observable<any> {
        return this.http.get(SERVER + GET_MY_PROFILE_URI, this.getOptions())
            .map(res => {
                console.log(this.user.profile);
                this.user.profile = res.json();
                return this.user.profile;
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    createMyProfile(myProfile): Observable<any> {
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateMyProfile(myProfile): Observable<any> {
        delete myProfile.mugshot;
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    reset(email) : Observable<any> {
        return this.http.post(SERVER + RESET_URI, email, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }  
    resetConfirm(resetObject) : Observable<any> {
        return this.http.post(SERVER + RESET_CONFIRM_URI, resetObject, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }  
    changePassword(passwords) : Observable<any> {
        return this.http.post(SERVER + CHANGE_PASSWORD_URI, passwords, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateMyPreferences(myPreferences): Observable<any> {
        return this.http.put(SERVER + UPDATE_MY_PREFERENCES_URI, myPreferences, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getOptions() {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'application/json;q=0.9');        
        headers.append('Accept', 'application/json;q=0.9');
        return new RequestOptions({ headers: headers });
    }

}