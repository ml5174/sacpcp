import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LOGIN_URI } from '../provider/config';
import { REGISTER_URI } from '../provider/config';
import { RESET_URI } from '../provider/config';
import { CHANGE_PASSWORD_URI } from '../provider/config';
import { REGISTER_USER_URI } from '../provider/config';
import { GET_AVAILABLE_PREFERENCES_URI } from '../provider/config';
import { GET_MY_PROFILE_URI } from '../provider/config';
import { GET_MY_PREFERENCES_URI } from '../provider/config';
import { SERVER } from '../provider/config';
import { UPDATE_MY_PROFILE_URI } from '../provider/config';
import { UserProfile } from '../model/user-profile';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserServices {
    public user: UserProfile = new UserProfile();
    private storage: Storage = new Storage();
    constructor(private http: Http) {
    }

    login(body): Observable<any> {

        return this.http.post(SERVER + LOGIN_URI, body)
            .map(res => {
                this.user.name = body.username;
                this.user.id = res.json().key;
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    register(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    registerUser(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_USER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    update(body): Observable<any> {
        return this.http.post(SERVER + REGISTER_USER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    get(): Observable<any> {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'text/plain');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(SERVER + REGISTER_USER_URI, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAvailablePreferences(): Observable<any> {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'text/plain');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(SERVER + GET_AVAILABLE_PREFERENCES_URI, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getMyPreferences(): Observable<any> {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'text/plain');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(SERVER + GET_MY_PREFERENCES_URI, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getMyProfile(): Observable<any> {
        let user = this.user
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'text/plain');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(SERVER + GET_MY_PROFILE_URI, options)
            .map(res => {
                console.log(user.profile);
                user.profile = res.json();
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    createMyProfile(myProfile): Observable<any> {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateMyProfile(myProfile): Observable<any> {
        delete myProfile.mugshot;
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    reset(email) : Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(SERVER + RESET_URI, email)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }  
    changePassword(passwords) : Observable<any> {
        let headers = new Headers();
        if (this.user) if (this.user.id) headers.append('Authorization', 'Token ' + this.user.id);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.put(SERVER + CHANGE_PASSWORD_URI, passwords, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}