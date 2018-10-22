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
import { Storage } from '@ionic/storage';
import { GET_USERS_URI } from '../provider/config';

@Injectable()
export class UserServices {
    public user: UserProfile = new UserProfile();
    private _myPreferences: Observable<any> = null; // for myPreference caching
    private _myProfile: Observable<any> = null;     // for muProfile caching
    userIdSource: BehaviorSubject<number> = new BehaviorSubject<number>(this.user.id);
    userIdChange: Observable<number> = this.userIdSource.asObservable().share();
   
    constructor(private http: Http, public storage: Storage) {
    }
    getAllUsers() {
        return this.http.get(SERVER + GET_USERS_URI, this.getOptions())
                .map(res => res.json())
                .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    setId(id: number) {
        this.user.id = id;
        this.userIdSource.next(id);
    }
    unsetId() {
        this.setId(null);
    }
    logout() {
        this.storage.set('key', undefined);
        this.storage.remove('key');/* To remove key tokens */
        var _userName = this.user.name.toString();
        this.storage.clear();/* Clearing any residual content */
        this.storage.set('username',_userName);/* Retain UserName */
        this.user = new UserProfile();
        this.unsetId();       
    }
    login(body): Observable<any> {
        return this.http.post(SERVER + LOGIN_URI, body, this.getOptions())
            .map(res => {
                this.user.name = body.username;
                this.user.key = res.json().key;
                this.setId(res.json().key);
                console.info("user_profile.key: " + this.user.key + "; id: " + this.user.id);
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
        if(!this._myPreferences) {
            console.info("actual http:// getMyPreferences called!!");
            this._myPreferences = this.http.get(SERVER + GET_MY_PREFERENCES_URI, this.getOptions())
                .map(res => res.json()).publishReplay(1)
                .catch((error: any) => Observable.throw(error || 'Server error'));
        }
        else {
            console.info("cached getMyPreferences used!!");
        }
        return this._myPreferences;
    }

    getMyProfile(): Observable<any> {
        let userServicesThis = this;
        console.info("user.getMyProfile called!!");
        if(!userServicesThis._myProfile) {
            console.info("user.getMyProfile get http!!");
            userServicesThis._myProfile = this.http.get(SERVER + GET_MY_PROFILE_URI, this.getOptions())
                .map(res => {
                    userServicesThis.user.profile = res.json();
                    console.info("user.getMyProfile observable has 'nexted' ")
                    return userServicesThis.user.profile;
                }).publishReplay(1)
                .catch((error: any) => Observable.throw(error || 'Server error'));
        }
        else {
            console.info("cached getMyProfile used!!");
        }
        return userServicesThis._myProfile;
    }
    createMyProfile(myProfile): Observable<any> {
        this._myProfile = null;
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateMyProfile(myProfile): Observable<any> {
        delete myProfile.mugshot;
        this._myProfile = null;
        return this.http.put(SERVER + UPDATE_MY_PROFILE_URI, myProfile, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    reset(email): Observable<any> {
        return this.http.post(SERVER + RESET_URI, email, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    resetConfirm(resetObject): Observable<any> {
        return this.http.post(SERVER + RESET_CONFIRM_URI, resetObject, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    changePassword(passwords): Observable<any> {
        return this.http.post(SERVER + CHANGE_PASSWORD_URI, passwords, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateMyPreferences(myPreferences): Observable<any> {
        this._myPreferences = null; // clear cached.myPreferences
        return this.http.put(SERVER + UPDATE_MY_PREFERENCES_URI, myPreferences, this.getOptions())
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getOptions() {
        let headers = new Headers();
        if (this.user && this.user.id) {
            headers.append('Authorization', 'Token ' + this.user.id);
        }
        headers.append('Content-Type', 'application/json;q=0.9');
        headers.append('Accept', 'application/json;q=0.9');
        return new RequestOptions({ headers: headers });
    }
    isAdmin(){
       if(this.user.profile.accounttype && this.user.profile.accounttype.length >0){
          var i = this.user.profile.accounttype.length;
          while (i--) {
               if (this.user.profile.accounttype[i] === "A") {
                  return true;
                }
          }
       }
       return false;
    }

}