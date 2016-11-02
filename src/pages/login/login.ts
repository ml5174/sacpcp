import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserServices } from '../../service/user';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import { ForgotPage } from '../forgot/forgot';
import { HomePage } from '../home/home';
import { TranslateService } from "ng2-translate/ng2-translate";
import { STRINGS } from '../../provider/config';
import { UseridPopover } from '../../popover/userid';
import { PasswordPopover } from '../../popover/password';

@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

  username: string = '';
  password: string = '';
  showpassword: string = 'password';
  usernameerror: boolean = false;
  passworderror: boolean = false;
  remember: boolean = true;
  key: any = { key: 'key' };
  errors: Array<string> = [];
  val: any;
  constructor(private nav: NavController,
    private navParams: NavParams,
    private userServices: UserServices,
    private translate: TranslateService,
    public storage: Storage,
    private popoverCtrl: PopoverController
    ) {

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
    var loginPage = this;
    this.errors = [];
    this.usernameerror = false;
    this.passworderror = false;

    if (this.remember) this.storage.set('username', this.username);
    else this.storage.set('username', '');

    let loginobject = {
      username: this.username,
      password: this.password
    }
    


    console.log(loginobject);
    this.userServices.login(loginobject)
      .subscribe(
      key => {
        if (loginPage.remember) 
          loginPage.storage.set('key', loginPage.userServices.user.id);
      //  loginPage.storage.set('test', 'test');

        loginPage.userServices.getMyProfile();
        loginPage.nav.setRoot(HomePage);
      },
      err => this.setError(err));
  }
  register() {
    this.nav.push(RegisterLoginPage);
  }
  forgot() {
    this.nav.push(ForgotPage);
  }
  back() {
    this.nav.pop();
  }
  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
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

  presentPopover(ev) {

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
