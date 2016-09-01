import {Component} from '@angular/core'
import {LoginServices} from '../../service/login';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import { LogonPage } from '../logon/logon';

@Component({
  templateUrl: 'build/pages/register-login/register-login.html',
  providers: [LoginServices]
})
export class RegisterLoginPage {
  username: string = '';
  password1: string = '';
  password2: string = '';
  email: string = '';
  key: string = '';
  val: string = '';
  errors: Array<string> = [];

  constructor(private nav: NavController,
    private loginServices: LoginServices) {

  }

  register() {
    this.errors = [];
    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: this.email
    }
    this.loginServices.register(register)
      .subscribe(
      key => {
        this.key = key;
        /* TEMP CODE until confirmation flow is established */
        this.nav.push(LogonPage, { key: key });
      },
      err => {
        console.log(err);
        this.setError(err);
      });

  }
  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          this.errors.push(STRINGS[key] + ': ' + error[key][val].toString());
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }
}
