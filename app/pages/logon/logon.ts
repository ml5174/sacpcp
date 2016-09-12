import {Component} from '@angular/core';
import { UserServices } from '../../service/user';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav, NavParams} from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import { ForgotPage } from '../forgot/forgot';
import {TabsPage} from '../tabs/tabs';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {STRINGS} from '../../provider/config';

@Component({
  templateUrl: 'build/pages/logon/logon.html',
  pipes: [TranslatePipe]
})
export class LogonPage {
  storage: Storage = new Storage(LocalStorage);
  username: string = '';
  password: string = '';
  usernameerror: boolean = false;
  passworderror: boolean = false;
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
    this.usernameerror = false;
    this.passworderror = false;

    if (this.remember) this.storage.set('username', this.username);
    else this.storage.set('username', '');
    let login = {
      username: this.username,
      password: this.password
    }
    this.userServices.login(login)
      .subscribe(
      key => {
        this.nav.push(TabsPage);
      },
      err => this.setError(err));
  }
  register() {
    this.nav.push(RegisterLoginPage);
  }
  forgot() {
    this.nav.push(ForgotPage);
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
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push( field + error[key][val].toString());
          if (key==='username') this.usernameerror=true;
          if (key==='password') this.passworderror=true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }
  }
}
