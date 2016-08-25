import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {LOGIN_URI} from '../provider/config';
import {REGISTER_URI} from '../provider/config';

@Injectable()
export class LoginServices {
    constructor(private http: Http) {
    }
    //    username: "testuser"
    //    password: "password123"
    login(body): Observable<any> {
        return this.http.post(LOGIN_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    register(body): Observable<any> {
        return this.http.post(REGISTER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
}