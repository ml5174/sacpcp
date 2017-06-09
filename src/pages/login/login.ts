import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserServices } from '../../lib/service/user';
import { SignupAssistant } from '../../lib/service/signupassistant';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, PopoverController,ViewController,App,AlertController } from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import { ForgotPage } from '../forgot/forgot';
import { HomePage } from '../home/home';
import { TranslateService } from "ng2-translate/ng2-translate";
import { STRINGS } from '../../lib/provider/config';
import { UseridPopover } from '../../popover/userid';
import { PasswordPopover } from '../../popover/password';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';



@Component({
  templateUrl: 'login.html',
})

export class LoginPage {
  
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

  public username: string = '';
  public password: string = '';
  public showpassword: string = 'password';
  public usernameerror: boolean = false;
  public passworderror: boolean = false;
  public remember: boolean = true;
  public key: any = { key: 'key' };
  public errors: Array<string> = [];
  public val: any;
  private loginSuccess: boolean = false;

  constructor(public nav: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public translate: TranslateService,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    private signupAssistant: SignupAssistant,
    private volunteerEventsService: VolunteerEventsService,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public appCtrl: App
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
    this.usernameerror = false;
    this.passworderror = false;

    if (this.remember) this.storage.set('username', this.username);
    else this.storage.set('username', '');

    let loginobject = {
      username: this.username,
      password: this.password
    }

    this.userServices.login(loginobject)
      .subscribe(
      key => {
        this.loginSuccess = true;
        if (loginPage.remember) 
          loginPage.storage.set('key', loginPage.userServices.user.id);
      //  loginPage.storage.set('test', 'test');

        loginPage.userServices.getMyProfile().subscribe(
                                 result => result, 
                                 err => {
                                   this.loginSuccess = false;
                                     console.log(err);
                                 });
        if(this.signupAssistant.getGuestSignup()){
            this.signupAssistant.setGuestSignup(false);
            this.volunteerEventsService
                .checkMyEvents(this.signupAssistant.getCurrentEventId()).subscribe(
                res => {  
                    this.signupAssistant.signupEventRegistration();
                },
                err => {
                    console.log(err);
                    let confirm = this.alertCtrl.create({
                            title: '',
                            cssClass: 'alertReminder',
                            message: 'You Have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the about me page?',
                            buttons: [
                                {
                                    text: 'No',
                                    handler: () => {
                                        console.log('No clicked');
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        console.log('Yes clicked');
                                        this.viewCtrl.dismiss();
                                        this.appCtrl.getRootNav().push(RegisterIndividualProfilePage,{errorResponse:err});
                                    }
                                }
                            ]
                    });
                    confirm.present();
                });
        }                         
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
  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
  }
  setError(error) {
    this.errors = [];
    
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

  back() {
    this.nav.popToRoot();
  }

  presentPasswordPopover(ev) {

    let popover = this.popoverCtrl.create(PasswordPopover, {
    });

    popover.present({
      ev: ev
    });
  }
}
