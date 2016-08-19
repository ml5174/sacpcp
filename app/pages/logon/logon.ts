import {Component} from '@angular/core';
import {LoginServices} from '../../service/login';
import { Storage, LocalStorage } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/logon/logon.html',
  providers: [LoginServices]
})
export class LogonPage {
  storage: Storage = new Storage(LocalStorage);
  username: string = '';
  password: string = '';
  remember: boolean = true;
  key: any={key:'key'};
  constructor(private loginServices: LoginServices) {
     this.storage.get('username')
      .then( 
          value => this.username = value 
      );
  }
  login() {
    if (this.remember) this.storage.set('username', this.username);
    else this.storage.set('username', '');
    let login = {
      username: this.username,
      password: this.password
    }
    this.loginServices.login(login)
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
          })
  }
}
