import { Component, ViewChild } from '@angular/core'
import { UserServices } from '../../lib/service/user';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { STRINGS } from '../../lib/provider/config';
import { TranslateService } from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { PasswordPopover } from '../../popover/password';
import { UseridPopover } from '../../popover/userid';
import { PrivacyTermsModal } from '../../modals/privacy-terms-modal';
import { Storage } from '@ionic/storage';
import { ContactMethod } from '../../lib/components/ContactMethod/contactMethod.component';
import { Content } from 'ionic-angular';

@Component({
  templateUrl: 'register-login.html'
})
export class RegisterLoginPage {
  public username: string = '';
  public password1: string = '';
  public showpassword: string = 'password';
  public password2: string = '';
  public email: string = '';
  public sms: string = '';

  public usernameerror: boolean = false;
  public password1error: boolean = false;
  public password2error: boolean = false;
  public emailerror: boolean = false;
  public smserror: boolean = false;
  public termserror: boolean = false;
  public nonFieldsError: boolean = false;

  // Error values
  public usernameerrorvalue: string = 'This field is required.';
  public password1errorvalue: string = 'This field is required.';
  public password2errorvalue: string = '';
  public emailerrorvalue: string = '';
  public smserrorvalue: string = '';
  public termserrorvalue: string = "You must accept Privacy and Terms to proceed.";
  public nonFieldsErrorValue = '';

  private modalClicked: boolean = false;
  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];

  @ViewChild(Content) content: Content;
  @ViewChild(ContactMethod)
  public contactMethod: ContactMethod;
  public terms: boolean = false;
  public remember: boolean = true;
  public storage: Storage = new Storage();
  public pcmethod: string = 'email'
  public meetsRequirement: boolean = false;
  constructor(public nav: NavController,
    public userServices: UserServices,
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ){}

  promiseToScroll() {
    //needed to allow view to refresh with error elements before scroll
    console.log("returning promise to life");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(42);
      }, 200);
    });
  }

  checkContactMethod() {
    console.log("checking contact method");
      this.emailerror=false;
      this.smserror=false;
    if(this.contactMethod.pcmethod==='email') {
      let email = this.contactMethod.pcvalue;
      if(email) {
        let at=email.indexOf('@');
        let dot=email.lastIndexOf('.');
        let length=email.length;
        if(at===-1 || dot===-1 || dot<at || length-1===dot) {
          this.emailerror=true;
          this.emailerrorvalue='Enter a valid email address.'
        }
      } else {
        this.emailerror=true;
        this.emailerrorvalue='This field is may not be empty.';
      }
    } else {
      if(!this.contactMethod.mobilenumber) {
        this.smserror=true;
        this.smserrorvalue='This field may not be empty.';
      }
      if(this.contactMethod.mobilenumber.getPN().length<11) {
        this.smserror=true;
        this.smserrorvalue='Mobile number should be 10 digits.';
      }
    }
    return this.emailerror || this.smserror;
  }

  checkPasswordsMatching() {
    this.password2error=false;
    if(this.password1 && this.password1!=='') {
      if(this.password1!==this.password2) {
        this.meetsRequirement=false;
        this.password2error=true;
        this.password2errorvalue='Your passwords do not match.';
      }
    }
    return this.password2error;
  }

  clearContactErrors() {
    this.emailerror=false;
    this.smserror=false;
  }

  checkUsername() {
    this.usernameerror=false;
    var regEx = new RegExp('[^A-Z][^a-z][^0-9][^@][^+][^.][^-]');
    if(this.username.match(regEx)) {
      this.usernameerror=true;
      this.usernameerrorvalue='Username does not meet complexity requirements.';
    } else if(!this.username || this.username==='') {
      this.usernameerror=true;
      this.usernameerrorvalue='This field may not be empty.';
    }else if(this.username.length<8) {
      this.usernameerror=true;
      this.usernameerrorvalue='Username must be at least 8 characters.';
    } else if(this.username.length>30) {
      this.usernameerror=true;
      this.usernameerrorvalue='Username must be less than 30 characters';
    }
    return this.usernameerror;
  }

  checkPassword1() {
    this.password1error=false;
    if(!this.password1) {
      this.password1error=true;
      this.password1errorvalue='This field may not be empty.';
    } else if(this.password1.length<8) {
      this.password1error=true;
      this.password1errorvalue='Password must be at least 8 characters.';
    } else if(this.password1===this.username) {
      this.password1error=true;
      this.password1errorvalue='Password must not match username.';
    } else if(!this.complexPassword()) {
      this.password1error=true;
      this.password1errorvalue= 'This password does not meet complexity requirements.';//'Password must contain at least 3 of the following characteristics: 1. Uppercase English letters\n2. Lowercase English letters\n3. Numbers\n4. Non-alphanumeric characters \" # $ % & \' ( ) * + , - . : ; < = > ? @ [ \\ ] ^ { }';
    }
    return this.password1error;
  }

  complexPassword() {
    var uppercase = new RegExp('[A-Z]');
    var lowercase = new RegExp('[a-z]');
    var numbers = new RegExp('[0-9]');
    var specialCharacters = new RegExp('[" # $ % & \' ( ) * + , - . : ; < = > ? @ [ \\ ] ^ { }]');
    var numMatches = 0;
    if(this.password1.match(uppercase))
      numMatches++;
    if(this.password1.match(lowercase))
      numMatches++;
    if(this.password1.match(numbers))
      numMatches++;
    if(this.password1.match(specialCharacters))
      numMatches++;
    return (numMatches >= 3);
  }

  checkRequired() {
    // sets the variable meetsRequirement to true if required fields are not empty
    // contactMethod prefix 1 to the numbers entered
    //console.log("check rquired called, preffered contact method is ", this.contactMethod.pcmethod);
    if (this.contactMethod.pcmethod === 'email') {
      if (this.username && this.password1 && this.password2 && this.contactMethod.pcvalue && this.terms) {
        this.meetsRequirement = true;
        return true;
      }
      this.meetsRequirement = false;
      return false;
    }
    if (this.contactMethod.mobilenumber) {
      if (this.username && this.password1 && this.password2 && (this.contactMethod.mobilenumber.getPN().length >= 11) && this.terms) {
        this.meetsRequirement = true;
        //console.log("inside contactMEthodMobileNumber not falsey", this.contactMethod.mobilenumber.getPN());
        return true;
      }
    }
    this.meetsRequirement = false;
    return false;
  }

  checkAll() {
    let pw1 = this.checkPassword1();
    let u = this.checkUsername();
    let pwm = this.checkPasswordsMatching();
    let r = this.checkRequired();
    let cm = this.checkContactMethod();
    let test = pw1 || u || pwm || r || cm;
    return test;
  }

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

    this.usernameerrorvalue = '';
    this.password1errorvalue = '';
    this.password2errorvalue = '';
    this.emailerrorvalue = '';
    this.smserrorvalue = '';

    // register object we're passing to the api
    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: undefined,
      phone: undefined,
      tandc: 1
    }

    if (!this.terms) {
      // this.errors.push("You must accept Privacy and Terms below to proceed.");
      this.termserror = true;
      this.content.scrollToBottom();
      let scrollToBottomPromise = this.promiseToScroll();
      let registerScope = this;
      scrollToBottomPromise.then(function () {
        registerScope.content.scrollToBottom();
      });
      this.checkAll();
      return;
    }
    this.termserror = false;

    if (this.contactMethod.pcmethod === 'email') {
      this.email = this.contactMethod.pcvalue;
      register.email = this.email;
    }
    else {
      this.sms = this.contactMethod.mobilenumber.getPN();
      register.phone = this.sms;
      console.log('about to register with: ' + register.phone);
    }

    if (!register.email) delete register.email;
    if (!register.phone) delete register.phone;

    if(!this.checkAll()) {
    this.userServices.register(register)
      .subscribe(
        key => {
          this.key = key;
          this.userServices.user.name = this.username;

          if (this.remember) {
            this.storage.set('username', this.username);
            this.storage.set('key', this.userServices.user.id);
          }
          else this.storage.set('username', '');
          registerLogin.nav.setPages([HomePage, RegisterIndividualProfilePage]);
        },
        err => {
          console.log(err);
          this.setError(err);
        });
    }
  }

  back() {
    this.nav.popToRoot();
  }

  openModal() {
    let modal = this.modalCtrl.create(PrivacyTermsModal);
    modal.onDidDismiss(data => {
      console.log(data);
      this.modalClicked = true;
      this.terms = data.agree;
      if (!this.terms) {
        this.termserror = true;
        let scrollToBottomPromise = this.promiseToScroll();
        let registerScope = this;
        scrollToBottomPromise.then(function () {
          registerScope.content.scrollToBottom();
        });
      }
      this.checkRequired();
    });
    modal.present();
  }


  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          var message = error[key][val].toString();
          if (key === 'username') {
            this.usernameerror = true;
            this.usernameerrorvalue = message;
          }
          if (key === 'password1') {
            this.password1error = true;
            this.password1errorvalue = message;
          }
          if (key === 'password2') {
            this.password2error = true;
            this.password2errorvalue = message;
          }
          if (key === 'email') {
            this.emailerror = true;
            this.emailerrorvalue = message;
          }
          if (key === 'phone') {
            this.smserror = true;
            this.smserrorvalue = message;
          }
          if (key === 'non_field_errors') {
            this.nonFieldsError = true;
            this.nonFieldsErrorValue = message;
          }
        }
      }
      // scroll to top of page
      let promToScroll = this.promiseToScroll();
      let registerScope = this;
      promToScroll.then(() => {
        registerScope.content.scrollToTop();
      });
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }
  }

  viewTerms() {
    this.openModal();
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



// WEBPACK FOOTER //
// ./src/pages/register-login/register-login.ts