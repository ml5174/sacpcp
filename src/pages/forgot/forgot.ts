import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import { LoginPage } from '../login/login';
import {TranslateService} from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'forgot.html'
})
export class ForgotPage {
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
    private userServices: UserServices,
              private translate: TranslateService) {

  }

  forgot() {
    this.nav.push(LoginPage);
  }

  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          if (key === 'username') this.usernameerror = true;
          if (key === 'password1') this.password1error = true;
          if (key === 'password2') this.password2error = true;
          if (key === 'email') this.emailerror = true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }
  back() {
    this.nav.setRoot(HomePage);
  }
}
