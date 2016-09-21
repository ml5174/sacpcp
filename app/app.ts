import {Component, ViewChild} from '@angular/core';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {TabsPage} from './pages/tabs/tabs';
import {LogonPage} from './pages/logon/logon';
import {RegisterLoginPage} from './pages/register-login/register-login';
import {RegisterIndividualProfilePage} from './pages/register-individual-profile/register-individual-profile';
import {UserServices} from './service/user';

@Component({
  templateUrl: 'build/app.html',
  providers: [UserServices,
  { 
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
      deps: [Http]
    },
    TranslateService],
    pipes: [TranslatePipe]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private translate: TranslateService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Login', component: LogonPage },
      { title: 'Home', component: TabsPage },
      { title: 'Login Registration', component: RegisterLoginPage },
      { title: 'Profile Registration', component: RegisterIndividualProfilePage }
    ];

    // use navigator lang if English(en) or Spanish (es)
    var userLang = navigator.language.split('-')[0]; 
    userLang = /(en|es)/gi.test(userLang) ? userLang : 'en';
    // set default language and language to use
    translate.setDefaultLang('en');
    translate.use(userLang);
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


