import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import { LogonPage } from '../logon/logon';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
import { ConfirmSMSPage } from '../confirm-sms/confirm-sms';
@Component({
  templateUrl: 'build/pages/register-login/register-login.html'
})
export class RegisterLoginPage {
  private username: string = '';
  private password1: string = '';
  private password2: string = '';
  private email: string = '';
  
  private usernameerror: boolean = false;
  private password1error: boolean = false;
  private password2error: boolean = false;
  private emailerror: boolean = false;
  private smserror: boolean = false;


  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];
  private pcmethod: string = 'email'
  constructor(private nav: NavController,
    private userServices: UserServices) {

  }

  register() {
    this.errors = [];
    this.usernameerror = false;
    this.password1error = false;
    this.password2error = false;
    this.emailerror = false;


        /* TEMP CODE until confirmation flow is established */
        if (this.pcmethod === 'sms') {
           this.nav.push(ConfirmSMSPage);
            return;
         //   this.smserror=true;
         //   this.errors.push("SMS not implemented");
            
        }

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
        if (this.pcmethod === 'email')
           this.nav.push(ConfirmEmailPage);
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
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          if (key==='username') this.usernameerror=true;
          if (key==='password1') this.password1error=true;
          if (key==='password2') this.password2error=true;
          if (key==='email') this.emailerror=true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }
}
