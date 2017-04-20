import { Component, ViewChild } from '@angular/core'
import { NavController } from 'ionic-angular';
import { STRINGS } from '../../lib/provider/config';
import { UserServices } from '../../lib/service/user';
import { TranslateService } from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { ContactMethod } from '../../lib/components/ContactMethod/contactMethod.component';
import { RecoverSuccessPage } from '../recover-success/recover-success.ts';

@Component({
  templateUrl: 'forgot.html'
})
export class ForgotPage {
  public username: string = '';
  public password1: string = '';
  public password2: string = '';
  public pcvalue: string = '';

  public email: string = '';
  // public mobileNumberAreaCode = "";
  // public mobileNumberPrefix = "";
  // public mobileNumberLineNumber = "";
  public mobileNumber = "";

  public usernameerror: boolean = false;
  public password1error: boolean = false;
  public password2error: boolean = false;
  public emailerror: boolean = false;
  public smserror: boolean = false;


  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];
  public pcmethod: string = 'email'

  @ViewChild(ContactMethod)
  public contactMethod: ContactMethod;

  constructor(public nav: NavController,
    public userServices: UserServices,
    public translate: TranslateService) {

  }

  forgot() {
    this.errors = [];
    let resetObject: any = {}
    /*
        if (this.pcmethod == "email") {
          resetObject.email = this.email;
        } else if (this.pcmethod == "sms") {
          let phone = null;
          if (this.mobileNumberAreaCode || this.mobileNumberLineNumber || this.mobileNumberPrefix) {
            phone = "1" + this.mobileNumberAreaCode + this.mobileNumberPrefix + this.mobileNumberLineNumber;
          }
          resetObject.phone = phone;
        }
    
    */

    if (this.contactMethod.pcmethod == "email") {
      resetObject.email = this.contactMethod.pcvalue;
    } else if (this.contactMethod.pcmethod == "sms") {
      let phone = null;
      // if (this.contactMethod.mobileNumberAreaCode || this.contactMethod.mobileNumberLineNumber || this.contactMethod.mobileNumberPrefix) {
      //   phone = "1" + this.contactMethod.mobileNumberAreaCode + this.contactMethod.mobileNumberPrefix + this.contactMethod.mobileNumberLineNumber;
      //   resetObject.phone = phone;
      // }
      if (this.contactMethod.mobilenumber) {
        phone = "1" + this.contactMethod.mobilenumber.pn;
        phone = phone.replace(/\D+/g, '')
        console.log('about to call forgot API with: ' + phone);
      }
      else {
        resetObject = {};
      }
    }


    this.userServices.reset(resetObject)
      .subscribe(
      key => {
        this.nav.push(RecoverSuccessPage);
      },
      err => this.setError(err));
  }

  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          if (key === 'email') this.emailerror = true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }
  back() {
    this.nav.pop();
  }
}
