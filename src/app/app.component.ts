import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Select, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { UserServices } from '../lib/service/user';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { MyGroupsPage } from '../pages/mygroups/mygroups';
import { CreateGroupPage } from '../pages/create-group/create-group';
import { UserProfile } from '../lib/model/user-profile';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TermsPage } from '../pages/terms/terms';
import { VolunteerEventsService } from '../lib/service/volunteer-events-service'
import { Admin } from '../pages/admin/admin';
import { PopoverController } from 'ionic-angular';
import { CreateEvent } from '../pages/admin/create-event/create-event';
import { EditEvent } from '../pages/admin/edit-event/edit-event';
import { Reports } from '../pages/admin/reports/reports';
import { ContactVolunteers } from '../pages/admin/contact-volunteers/contact-volunteers';
import { Groups } from '../pages/admin/groups/groups';
//import {AdminPopoverComponent} from '../lib/components/admin-popover.component';
import { ServerVersion } from '../providers/server-version';
import { version } from '../../package.json';
import { DONATE_URL } from '../lib/provider/config';
import { AppVersion } from 'ionic-native';
import { SERVER } from '../lib/provider/config';
import { GroupProfilePage } from '../pages/group-profile/group-profile';
import { EditGroupAttendancePage } from '../pages/edit-group-attendance/edit-group-attendance';
declare var window;
declare var cordova;

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
  adminPages: Array<{ title: string, component: any }>;
  username: String = "";
  appName: String = "";
  appPkgName: String = "";
  appMarketingVersion: String = "";
  appBuildVersion: String = "";
  serverENV: string = "";
  serverVersionNumber: string = "";
 
  appManager: any = {};
  public showAdmin: boolean;
  public showMyGroupsMenu: boolean;
  constructor(
    private statusBar: StatusBar,
    public platform: Platform,
    public config: Config,
    public menu: MenuController,
    public userServices: UserServices,
    public storage: Storage,
    public volunteerEvents : VolunteerEventsService,
    public popoverCtrl: PopoverController,
    public serverVersion:ServerVersion
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Login', component: LoginPage },                                        // 0 
      { title: 'Home', component: HomePage },                                          // 1
      { title: 'Login Registration', component: RegisterLoginPage },                   // 2 
      { title: 'Profile Registration', component: RegisterIndividualProfilePage },     // 3 
      { title: 'Change Password', component: ChangePasswordPage },                     // 4 
      { title: 'About', component: AboutPage },                                        // 5 
      { title: 'Contact Us', component: ContactPage },                                 // 6 
      { title: 'Privacy & Terms', component: TermsPage },                              // 7 
      { title: 'Admin', component: Admin },                                            // 8 
      { title: 'My Groups', component: MyGroupsPage },                                 // 9
      { title: 'Create Group', component: CreateGroupPage },                           // 10 
      { title: 'Group Profile', component: GroupProfilePage }
    ];
   
    this.adminPages = [
      { title: 'Create Event', component: CreateEvent },                               // 0 
      { title: 'Edit Event', component: EditEvent },                                   // 1
      { title: 'Reports', component: Reports },                                        // 2 
      { title: 'Contact Volunteers', component: ContactVolunteers },                   // 3 
      { title: 'Groups', component: Groups }                                           // 4 
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
      if (this.platform.is('core')) console.log("running on desktop browser");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is("ios") || this.platform.is("android")) {	
	      //StatusBar.show();
      	this.statusBar.overlaysWebView(false);
      	this.statusBar.styleDefault();
      	console.log(StatusBar);
      	//Keyboard.disableScroll(true);
      	Keyboard.hideKeyboardAccessoryBar(false);
      }

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
    console.log("app.component.ts: opening page");
  
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
    this.showAdmin=false;
    this.showMyGroupsMenu=false;
    this.menu.close();
    this.storage.set('key', undefined);
    this.userServices.unsetId();
    this.volunteerEvents.clearEvents();
    this.userServices.user = new UserProfile();
    this.nav.setRoot(HomePage);
  }
  donate() { 
     if(this.platform.is('ios') || this.platform.is('android')) { 
       if (cordova && cordova.InAppBrowser) { 
         cordova.InAppBrowser.open(DONATE_URL, '_blank'); 
       } else {
         window.open(DONATE_URL, '_blank'); 
       }
     }
     else {
       window.open(DONATE_URL, '_blank'); 
     }
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
    /*presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(AdminPopoverComponent);
    popover.present({
      ev: myEvent
    });
  }*/
showAdmin1()
{
  this.showAdmin=!this.showAdmin;
}

showMyGroups()
{
  this.showMyGroupsMenu=!this.showMyGroupsMenu;
}


   private getServerEnv() {
    console.log('SERVER:' + SERVER);
    if (SERVER != 'https://api.volunteers.tsadfw.org') {
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
          this.storage.set('serverVersion', '0.0');
          this.storage.set('serverEnv', 'N/A');
        } ,
        () => {
          console.log('getData completed');
        }
      );
    }
    else { 
      this.storage.set('serverEnv', 'prod');
      this.storage.set('serverVersion', '');
    }
   }

  private getAndWriteVersionInfo(){

    if(this.platform.is('ios') || this.platform.is('android')) {
      // 2018_01_29 tslint change removed block with AppName
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
    } else {
      this.storage.set('version', version).then((resource) => {
          console.log('Storing Marketing Version: ' + this.appMarketingVersion);
        });
      let buildNumberNonMobileFE = "_build_number_";
      this.storage.set('build', buildNumberNonMobileFE).then((resource) => {
         console.log('Storing Build Version: ' + buildNumberNonMobileFE);
        });
    }
  }


}
