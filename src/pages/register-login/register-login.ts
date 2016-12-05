import { Component } from '@angular/core'
import { UserServices } from '../../service/user';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { STRINGS } from '../../provider/config';
import { TermsPage } from '../terms/terms';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
import { ConfirmSMSPage } from '../confirm-sms/confirm-sms';
import { TranslateService } from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { PasswordPopover } from '../../popover/password';
import { UseridPopover } from '../../popover/userid';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'register-login.html'
})
export class RegisterLoginPage {
  private username: string = '';
  private password1: string = '';
  private showpassword: string = 'password';
  private password2: string = '';
  private email: string = '';
  private sms: string = '';

  private usernameerror: boolean = false;
  private password1error: boolean = false;
  private password2error: boolean = false;
  private emailerror: boolean = false;
  private smserror: boolean = false;

  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];
  private pcmethod: string = 'email'
  private pcvalue: string = '';
  private mobileNumberAreaCode = '';
  private mobileNumberPrefix = '';
  private mobileNumberLineNumber = '';

  private terms: boolean = false;
  private remember: boolean = true;
  private storage: Storage = new Storage();

  constructor(private nav: NavController,
    private userServices: UserServices,
    private translate: TranslateService,
    private popoverCtrl: PopoverController
  ) { }

  register() {
    let registerLogin = this;
    this.errors = [];
    this.usernameerror = false;
    this.password1error = false;
    this.password2error = false;
    this.emailerror = false;
    this.smserror = false;
    this.email = '';
    this.sms = '';

    if (this.pcmethod === 'email') this.email = this.pcvalue;
    else this.sms = this.mobileNumberAreaCode+this.mobileNumberPrefix+this.mobileNumberLineNumber;
    console.log("terms: " + this.terms);
    if (!this.terms) {
      this.errors.push("You must accept Privacy and Terms to proceed.");
      return;
    }

    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: this.email,
      phone: this.sms,
      tandc: 1
    }

    if (!register.email) delete register.email;
    if (!register.phone) delete register.phone;
    
    this.userServices.register(register)
      .subscribe(
      key => {
        this.key = key;
        let myProfile = {
          'User': registerLogin.username
        }
        this.userServices.user.name = this.username;
        
        if (this.remember) {
          this.storage.set('username', this.username);
          this.storage.set('key', this.userServices.user.id);
        }
        else this.storage.set('username', '');
        registerLogin.nav.setRoot(RegisterIndividualProfilePage);
        /* this.userServices.createMyProfile(myProfile)
           .subscribe(
           key => {
             registerLogin.key = key;
             registerLogin.nav.setRoot(RegisterIndividualProfilePage);
           },
           err => {
             console.log(err);
             this.setError(err);
           }),
           val => this.val = val;
           */
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
  viewTerms() {
    this.nav.push(TermsPage);
  }

  back() {
    this.nav.pop();
  }
  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
  }
  presentUserPopover(ev) {

    let popover = this.popoverCtrl.create(UseridPopover, {
    });

    popover.present({
      ev: ev
    });
  }
  presentPasswordPopover(ev) {

    let popover = this.popoverCtrl.create(PasswordPopover, {
    });

    popover.present({
      ev: ev
    });
  }
}
