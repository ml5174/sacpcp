import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Service} from '../model/service';

@Injectable()
export class Services {
    constructor(private http: Http) { 
    }
    private commentsUrl = 'backend-mock/services.json';
    getServices() : Observable<Service[]>{
        return this.http.get(this.commentsUrl)
            .map(res => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}