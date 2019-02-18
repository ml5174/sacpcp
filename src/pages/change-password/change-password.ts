import { Component } from '@angular/core'
import { UserServices } from '../../lib/service/user';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { STRINGS } from '../../lib/provider/config';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
import { TranslateService } from "@ngx-translate/core";
import { LoginPage } from '../login/login';
import { PasswordPopover } from '../../popover/password';

@Component({
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  public password: string = '';
  public password1: string = '';
  public showpassword: string = 'password';
  public password2: string = '';
  public email: string = '';
  public sms: string = '';
  public passworderror: boolean = false;
  public password1error: boolean = false;
  public password2error: boolean = false;
  public emailerror: boolean = false;
  public smserror: boolean = false;
  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];
  public pcmethod: string = 'email'
  public pcvalue: string = '';
  public meetsRequirement = false;
  public MINPWLENGTH = 1;

  constructor(public nav: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public translate: TranslateService,
    public popoverCtrl: PopoverController) {
      console.dir(navParams);

  }

  checkRequirement($event) {
    if (this.password1.length >= this.MINPWLENGTH && this.password2.length >= this.MINPWLENGTH) {
      this.meetsRequirement = true;
      return;
    }
    this.meetsRequirement = false;
  }
  register() {
    this.errors = [];
    this.passworderror = false;
    this.password1error = false;
    this.password2error = false;
    this.emailerror = false;
    this.smserror = false;
    this.email = '';
    this.sms = '';

    if (this.pcmethod==='email') this.email=this.pcvalue;
    else this.sms=this.pcvalue;

    let register = {
      new_password1: this.password1,
      new_password2: this.password2,
      uid: this.navParams.data.iud,
      token: this.navParams.data.key
      //, email: "test@email.com"
    }

    this.userServices.resetConfirm(register)
      .subscribe(
      key => {
        this.key = key;
        this.nav.setRoot(ConfirmEmailPage);
      },
      err => {
        console.log(err);
        this.setError(err);
      });

  }
  setError(error) {
    if (error.status === 400) {
      error = error.json();

      if (error['detail']) {
        console.log('error occured in change password: '+error['detail'])
        this.errors.push(error['detail']);
        return;
      }

      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          console.log('ERROR: '+field);
     //     if (key === 'password') this.passworderror = true;
          if (key === 'new_password1') this.password1error = true;
          if (key === 'new_password2') this.password2error = true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }
  back() {
    this.nav.push(LoginPage);
  }
  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
  }
  presentPasswordPopover(ev) {

    let popover = this.popoverCtrl.create(PasswordPopover, {
    });

    popover.present({
      ev: ev
    });
  }
}
