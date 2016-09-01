import {Component} from '@angular/core';
import { UserServices } from '../../service/user';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav, NavParams} from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/logon/logon.html'
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
    private userServices: UserServices) {

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
    this.errors = [];

    if (this.remember) this.storage.set('username', this.username);
    else this.storage.set('username', '');
    let login = {
      username: this.username,
      password: this.password
    }
    this.userServices.login(login)
      .subscribe(
      key => {
        /* Temp solution until login validation is implemented */
        if (this.key) {
          if (key !== this.key.key) this.errors.push('Login is different than one registered.');
          else {
            this.errors.push('Login Success, Registration Success.  Login again to go to the home page.');
            this.key = undefined;
          }
          return;
        }
        this.nav.push(TabsPage);
      },
      err => this.setError(err));
  }
  register() {
    this.nav.push(RegisterLoginPage);
  }
  setError(error) {

    if (error.status === 400) {
      error = error.json();
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
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }
  }
}
