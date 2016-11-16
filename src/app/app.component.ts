import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, Select } from 'ionic-angular';

import { StatusBar } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { UserServices } from '../service/user';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { UserProfile } from '../model/user-profile';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { VolunteerEventsService } from '../service/volunteer-events-service'

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
 
  key: any = { key: 'key' };
  errors: Array<string> = [];
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  username: String = "";
  appManager: any = {};
  constructor(
    public platform: Platform,
    public menu: MenuController,
    private userServices: UserServices,
    public storage: Storage,
    private volunteerEvents : VolunteerEventsService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Home', component: HomePage },
      { title: 'Login Registration', component: RegisterLoginPage },
      { title: 'Profile Registration', component: RegisterIndividualProfilePage },
      { title: 'About', component: AboutPage },
      { title: 'Contact Us', component: ContactPage }

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
          us.setId(value);
          us.getMyProfile();
        }
      });

    this.storage.get('username')
      .then(
      value => {
        console.log('username: ' + value);
        if (value) us.user.name = value;
      });
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

    });
  }

  openPage(page) {
    let currentPage = this.nav.getActive().component;
    console.log(currentPage);

    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.setRoot(HomePage);

    // navigate to the new page if it is not the current page
    if (page.component != currentPage) {
      this.nav.push(page.component);
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
}
