import {Component} from '@angular/core';
import {LoginServices} from '../../service/login';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav} from 'ionic-angular';
import {RegisterPage} from '../register/register';

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
  error: string = '';
  val: any;
  constructor(private nav: NavController,
              private loginServices: LoginServices) {
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
            this.setError(err);
          }),
          val => this.val = val;
  }
  register() {
    this.nav.push(RegisterPage);
  }
  setError(error) {
    if (error['non_field_errors']) this.error = error['non_field_errors'].toString();
    if (error['password']) this.error = error['password'].toString();
  }
}
