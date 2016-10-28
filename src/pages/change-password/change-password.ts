import { Component } from '@angular/core'
import { UserServices } from '../../service/user';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { STRINGS } from '../../provider/config';
import { TermsPage } from '../terms/terms';
import { TranslateService } from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { PasswordPopover } from '../../popover/password';

@Component({
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  private password: string = '';
  private password1: string = '';
  private showpassword: string = 'password';
  private password2: string = '';
  private email: string = '';
  private sms: string = '';

  private passworderror: boolean = false;
  private password1error: boolean = false;
  private password2error: boolean = false;
  private emailerror: boolean = false;
  private smserror: boolean = false;

  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];
  private pcmethod: string = 'email'
  private pcvalue: string = '';

  private terms: boolean = true;

  constructor(private nav: NavController,
    private userServices: UserServices,
    private translate: TranslateService,
    private popoverCtrl: PopoverController) {

  }
  register() {
    let registerLogin = this;
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
  //    old_password: this.password,
      new_password1: this.password1,
      new_password2: this.password2
    }

    this.userServices.changePassword(register)
      .subscribe(
      key => {
        this.key = key;
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
  viewTerms() {
    this.nav.push(TermsPage);
  }

  back() {
    this.nav.pop(HomePage);
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
