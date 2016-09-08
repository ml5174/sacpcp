import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import { LogonPage } from '../logon/logon';

@Component({
  templateUrl: 'build/pages/register-login/register-login.html'
})
export class RegisterLoginPage {
  private username: string = '';
  private password1: string = '';
  private password2: string = '';
  private email: string = '';
  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];
  private pcmethod: string = 'email'
  constructor(private nav: NavController,
    private userServices: UserServices) {

  }

  register() {
    this.errors = [];
    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: this.email
    }
    this.userServices.register(register)
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
