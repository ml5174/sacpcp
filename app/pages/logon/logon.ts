import {Component} from '@angular/core';
import {LoginServices} from '../../service/login';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav} from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import {TabsPage} from '../tabs/tabs';

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
  errors: Array<string> = [];
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
          key => {
            this.key = key;
            this.nav.push(TabsPage, {key: key});
          }, 
          err => { 
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
  }
  register() {
    this.nav.push(RegisterLoginPage);
  }
  setError(error) {
    for (let key in error) {
      for (let val in error[key]) {
        this.errors.push(error[key][val].toString());
      }
    }
  }
}
