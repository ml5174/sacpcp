import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserServices } from '../../lib/service/user';
import { SignupAssistant } from '../../lib/service/signupassistant';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, PopoverController,ViewController,App,AlertController, Events } from 'ionic-angular';
import { RegisterLoginPage } from '../register-login/register-login';
import { ForgotPage } from '../forgot/forgot';
import { HomePage } from '../home/home';
import { TranslateService } from "@ngx-translate/core";
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
    public appCtrl: App,
    public navCtrl: NavController,
    public ev: Events
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
        loginPage.storage.set('key', loginPage.userServices.user.key);
        loginPage.userServices.getMyProfile().subscribe(
                                 result => result,
                                 err => {
                                   this.loginSuccess = false;
                                     console.error(err);
                                 });

        if(this.signupAssistant.getGuestSignup()){

            this.signupAssistant.setGuestSignup(false);
            this.volunteerEventsService
                .checkMyEvents(this.signupAssistant.getCurrentEventId()).subscribe(
                res => {
                    this.signupAssistant.signupEventRegistration();
                },
                err => {
<<<<<<< HEAD
                    console.error("Sign up error: " + err);
=======
                    console.error("Sign up error: " + JSON.stringify(err));
>>>>>>> 807581ae0d7e6f33c3b969bc80abc7e90aa04acf
                    if(err._body.indexOf("Event Registration is full. We encourage you to search for similar events scheduled.") > 0){
                      let confirm = this.alertCtrl.create({
                            title: '',
                            cssClass: 'alertReminder',
                            message: 'Event registration is full.',
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: () => {
                                        console.log('Ok, clicked');
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    } else if (err._body.non_field_errors.includes(item => item.event_conflict && item.event_conflict === "You are already registered for this event.")) {
                        let confirm = this.alertCtrl.create({
                            title: '',
                            cssClass: 'alertReminder',
                            message: 'You are already registered for this event.',
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: () => {}
                                }
                            ]
                        });
                        confirm.present();
                    } else{
                      let confirm = this.alertCtrl.create({
                              title: '',
                              cssClass: 'alertReminder',
                              message: 'You Have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the My Profile page?',
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
                    }
                });
        }

         if(this.navParams.get('fromPage')){
           this.navCtrl.pop().then(() => {
         // Trigger custom event and pass data to be send back
         this.ev.publish('user-event-flow', this.navParams.get("event_id"));
         //new
        });
      }else{
        loginPage.nav.setRoot(HomePage);
      }



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
