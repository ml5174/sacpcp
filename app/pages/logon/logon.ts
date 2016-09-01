import {Component} from '@angular/core';
import {LoginServices} from '../../service/login';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav, NavParams} from 'ionic-angular';
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
  key: any = { key: 'key' };
  errors: Array<string> = [];
  val: any;
  constructor(private nav: NavController,
              private navParams: NavParams,
              private loginServices: LoginServices) {

/* Temp solution until login validation is implemented */
    this.key = navParams.get('key');
    if (this.key) this.errors.push('Please login to validate your password.');

    this.storage.get('username')
      .then(
      value => {
          if (value) this.username = value
        }
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
        if (key != this.key) {
          if (this.key) this.errors.push('Login is different than one registered.');
          return;
        }
        this.key = key;
        this.nav.push(TabsPage, { key: key });
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
    if (error['detail']) {
      this.errors.push(error['detail']);
      return;
    }

    for (let key in error) {
      for (let val in error[key]) {
        this.errors.push(error[key][val].toString());
      }
    }
  }
}
