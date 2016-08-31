import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {LOGIN_URI} from '../provider/config';
import {REGISTER_URI} from '../provider/config';
import {REGISTER_USER_URI} from '../provider/config';
import {SERVER} from '../provider/config';

@Injectable()
export class LoginServices {
    constructor(private http: Http) {
    }
    //    username: "testuser"
    //    password: "password123"
    login(body): Observable<any> {
        return this.http.post(SERVER+LOGIN_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    register(body): Observable<any> {
        return this.http.post(SERVER+REGISTER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    updateUser(body): Observable<any> {
        return this.http.post(SERVER+REGISTER_USER_URI, body)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
    getUser(loginKey): Observable<any> {
        let headers = new Headers();
        if (loginKey) if (loginKey.key) headers.append('Authorization', 'Token '+loginKey.key);
        headers.append('Content-Type', 'text/plain');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(SERVER+REGISTER_USER_URI, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
}