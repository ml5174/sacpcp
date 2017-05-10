import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SERVER } from '../lib/provider/config';

/*
  Generated class for the ServerVersion provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServerVersion {

  constructor(public http: Http) {
    console.log('Hello ServerVersion Provider');
  }

  getJsonData():any{
  console.log('endpoint is: ' + SERVER + '/is_alive/');
  return this.http.get(SERVER + '/is_alive/').map(res => res.json());
}

}
