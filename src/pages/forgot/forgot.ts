import {Component, ViewChild} from '@angular/core'
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import { UserServices } from '../../service/user';
import {TranslateService} from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { ContactMethod } from '../../components/ContactMethod/contactMethod.component';



@Component({
  templateUrl: 'forgot.html'
})
export class ForgotPage {
  private username: string = '';
  private password1: string = '';
  private password2: string = '';
  private pcvalue: string = '';

  private email: string = '';
  private mobileNumberAreaCode = "";
  private mobileNumberPrefix = "";
  private mobileNumberLineNumber = "";

  private usernameerror: boolean = false;
  private password1error: boolean = false;
  private password2error: boolean = false;
  private emailerror: boolean = false;
  private smserror: boolean = false;


  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];
  private pcmethod: string = 'email'

  @ViewChild(ContactMethod)
  public contactMethod: ContactMethod;

  constructor(private nav: NavController,
    private userServices: UserServices,
              private translate: TranslateService) {

  }

  forgot() {
    this.errors = [];
    let resetObject: any = {
    }
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
    } else if (this.contactMethod.pcmethod  == "sms") {
      let phone = null;
      if (this.contactMethod.mobileNumberAreaCode || this.contactMethod.mobileNumberLineNumber || this.contactMethod.mobileNumberPrefix) {
        phone = "1" + this.contactMethod.mobileNumberAreaCode + this.contactMethod.mobileNumberPrefix + this.contactMethod.mobileNumberLineNumber;
        resetObject.phone = phone;
      }
      else
      {
        resetObject= { };
      } 
    }
    

    this.userServices.reset(resetObject)
      .subscribe(
      key => {
        this.nav.push(HomePage);
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
