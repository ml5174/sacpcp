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

  // Error values
  public usernameerrorvalue: string = '';
  public password1errorvalue: string = '';
  public password2errorvalue: string = '';
  public emailerrorvalue: string = '';
  public smserrorvalue: string = '';
  public termserrorvalue: string = "You must accept Privacy and Terms to proceed.";

  private modalClicked: boolean = false;

  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];
  /* Move the email, Phone contact details to a common component -
     ViewChild(ContactMethod)
     This can be reused at multiple pages.
   */
  //public pcmethod: string = 'email'
  //public pcvalue: string = '';
  //public mobileNumberAreaCode = '';
  //public mobileNumberPrefix = '';
  // public mobileNumberLineNumber = '';
  // ionic content to control scrolling
  @ViewChild(Content) content: Content;
  @ViewChild(ContactMethod)
  public contactMethod: ContactMethod;
  public terms: boolean = false;
  public remember: boolean = true;
  public storage: Storage = new Storage();
  public pcmethod: string = 'email'

  constructor(public nav: NavController,
    public userServices: UserServices,
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) { }

  promiseToScroll() {
    //needed to allow view to refresh with error elements before scroll
    console.log("returning promise to life");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(42);
      }, 200);
    });
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

    if (!this.terms) {
      this.errors.push("You must accept Privacy and Terms below to proceed.");
      this.termserror = true;
      this.content.scrollToBottom();
      let scrollToBottomPromise = this.promiseToScroll();
      let registerScope = this;
      scrollToBottomPromise.then(function () {
        registerScope.content.scrollToBottom();
      });
      return;
    }
    this.termserror = false;

    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: undefined,
      phone: undefined,
      tandc: 1
    }

    if (this.contactMethod.pcmethod === 'email') {
      this.email = this.contactMethod.pcvalue;
      register.email = this.email;
    }
    else {
      // this.sms = '1'+this.contactMethod.mobileNumberAreaCode +
      // this.contactMethod.mobileNumberPrefix+
      // this.contactMethod.mobileNumberLineNumber;
      this.sms = this.contactMethod.mobilenumber.getPN();
      register.phone = this.sms;
      console.log('about to register with: ' + register.phone);
    }

    if (!register.email) delete register.email;
    if (!register.phone) delete register.phone;

    this.userServices.register(register)
      .subscribe(
      key => {
        this.key = key;
        // let myProfile = {
        //   'User': registerLogin.username
        // }
        this.userServices.user.name = this.username;

        if (this.remember) {
          this.storage.set('username', this.username);
          this.storage.set('key', this.userServices.user.id);
        }
        else this.storage.set('username', '');
        // registerLogin.nav.insert(registerLogin.nav.length(),HomePage);
        registerLogin.nav.setPages([HomePage, RegisterIndividualProfilePage]);


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
          // if (key === 'username') {
          //   this.usernameerror = true;
          //   this.errors.push(field + 'Invalid Format');
          // } else {
          //   this.errors.push(field + error[key][val].toString());
          // }
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
          if (key === 'sms') {
            this.smserror = true;
            this.smserrorvalue = message;
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
    //this.nav.push(TermsPage);
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
