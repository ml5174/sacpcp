import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, Select, Config } from 'ionic-angular';

import { StatusBar } from 'ionic-native';
import { Keyboard } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { UserServices } from '../lib/service/user';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { UserProfile } from '../lib/model/user-profile';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TermsPage } from '../pages/terms/terms';
import { VolunteerEventsService } from '../lib/service/volunteer-events-service'
import { AppVersion } from 'ionic-native';
import { ServerVersion } from '../providers/server-version';

@Component({
  templateUrl: 'app.html',
  providers:[ServerVersion]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
 
  key: any = { key: 'key' };
  errors: Array<string> = [];
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  username: String = "";
  appName: String = "";
  appPkgName: String = "";
  appMarketingVersion: String = "";
  appBuildVersion: String = "";
  serverENV: string = "";
  serverVersionNumber: string = "";
 
  appManager: any = {};
  constructor(
    public platform: Platform,
    public config: Config,
    public menu: MenuController,
    public userServices: UserServices,
    public storage: Storage,
    public volunteerEvents : VolunteerEventsService,
    public serverVersion:ServerVersion 
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Home', component: HomePage },
      { title: 'Login Registration', component: RegisterLoginPage },
      { title: 'Profile Registration', component: RegisterIndividualProfilePage },
      { title: 'Change Password', component: ChangePasswordPage },
      { title: 'About', component: AboutPage },
      { title: 'Contact Us', component: ContactPage },
      { title: 'Privacy & Terms', component: TermsPage }
    ];

  }

  initializeApp() {
    let us = this.userServices;
    this.detectOldIE();
    
    this.storage.get('key')
      .then(
      value => {
        console.log('key: ' + value);
        if (value) {
          console.log("value is true, profile call should happen");
          us.setId(value);
          us.getMyProfile().subscribe(
                                 result => result, 
                                 err => {
                                     console.log(err);
                                 });
        }
      });

    this.storage.get('username')
      .then(
      value => {
        console.log('username: ' + value);
        if (value) us.user.name = value;
      });

    console.log("before ready!"); 
    this.platform.ready().then(() => {
    console.log("after ready!");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.hide();
      //Keyboard.disableScroll(true);
      Keyboard.hideKeyboardAccessoryBar(false);

      //Only turn these off if its not android.
      if (!this.platform.is("android")) {
        this.config.set("scrollAssist", false);
        this.config.set("autoFocusAssist", false);
      }
       
      this.getAndWriteVersionInfo();
      this.getServerEnv();
  });

   
  }

  openPage(page, tab) {
    console.log("open page!");
    let currentPage = this.nav.getActive().component;

    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.setRoot(HomePage);

    // navigate to the new page if it is not the current page
    if (page.component != currentPage) {
      this.nav.push(page.component, {tab:tab});
    } else {
      this.nav.push(page.component, {tab:tab}, {animate: false});
    }
  }
  logout() {
    this.menu.close();
    this.storage.set('key', undefined);
    this.userServices.unsetId();
    this.volunteerEvents.clearEvents();
    this.userServices.user = new UserProfile();
    this.nav.setRoot(HomePage);
  }
  donate() {
    window.open('http://www.salvationarmydfw.org/p/get-involved/437', '_blank');
  }

  private detectOldIE() {

    var isOldIE = navigator.userAgent.match(/Trident/);

    if (isOldIE) {
      document.body.classList.add("ie-old");
      this.appManager.isOldIEVersion = true;

      (<any>Select).prototype._click = function (ev) {
        //alert("Monkey patched");
        // monkey patch the _click method for ion-select for IE as UIEvent.detail not supported
        /*if (ev.detail === 0) {
            // do not continue if the click event came from a form submit
            return;
        }*/
        ev.preventDefault();
        ev.stopPropagation(); 
        this.open();
      };
    }
  }

   private getServerEnv() {
    this.serverVersion.getJsonData().subscribe(
      result => {
        this.serverENV=result.ENV_NAME;
        this.serverVersionNumber=result.version;
        console.log("server environment : "+this.serverENV + '@ ' + this.serverVersionNumber);
        let serverVersionNumber: string = this.serverVersionNumber;
        let serverEnv: string = this.serverENV;
        this.storage.set('serverVersion', serverVersionNumber).then((resource) => {
         console.log('Storing Server Version: ' + serverVersionNumber);
       });

       this.storage.set('serverEnv', serverEnv).then((resource) => {
         console.log('Storing Server Environment: ' + serverEnv);
       });

      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        console.log('getData completed');
      }
    );
   }

  private getAndWriteVersionInfo(){
    if(this.platform.is('ios') || this.platform.is('android')) {
      AppVersion.getAppName().then((version) => {
        this.appName = version;
        console.log('AppName: ' + this.appName);
      })
      AppVersion.getPackageName().then((pkg) => {
        this.appPkgName = pkg;
        if (this.platform.is('android')) console.log('Package: ' + this.appPkgName);
        else console.log('BundleID: ' + this.appPkgName);
      })    
      AppVersion.getVersionNumber().then((marketingVersion) => {
        this.appMarketingVersion = marketingVersion;
        console.log('Marketing Version: ' + this.appMarketingVersion);
        this.storage.set('version', this.appMarketingVersion.toString()).then((resource) => {
          console.log('Storing Marketing Version: ' + this.appMarketingVersion);
        });
      })
      AppVersion.getVersionCode().then((buildVersion) => {
        this.appBuildVersion = buildVersion;
        console.log('Build Version: ' + this.appBuildVersion);
        this.storage.set('build', this.appBuildVersion.toString()).then((resource) => {
          console.log('Storing Build Version: ' + this.appBuildVersion);
        });
      })   
    }
  }
}

