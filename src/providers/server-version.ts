import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { map } from 'rxjs/add/operator/map';
import { SERVER } from '../lib/provider/config';


@Injectable()
export class ServerVersion {

  constructor(public http: Http) {
  }

  getJsonData():any{
  return this.http.get(SERVER + '/is_alive/').map(res => res.json());
}

}
