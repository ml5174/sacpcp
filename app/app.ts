import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {ListPage} from './pages/list/list';
import {LogonPage} from './pages/logon/logon';
import {RegisterLoginPage} from './pages/register-login/register-login';
import {RegisterIndividualProfilePage} from './pages/register-individual-profile/register-individual-profile';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Logon', component: LogonPage },
      { title: 'Home', component: TabsPage },
      { title: 'Services List', component: ListPage },
      { title: 'Login Registration', component: RegisterLoginPage },
      { title: 'Profile Registration', component: RegisterIndividualProfilePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);


