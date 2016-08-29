import {Component, ViewChild} from '@angular/core';
import {HomePage} from './home/home';
import {AwardsPage} from './awards/awards';
import {DonatePage} from './donate/donate';
import {VolunteerPage} from './volunteer/volunteer';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {LogonPage} from '../logon/logon';
import {LoginServices} from '../../service/login';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  providers: [LogonPage, LoginServices]
})
export class TabsPage {
  private homePage: any;
  private awardsPage: any;
  private donatePage: any;
  private volunteerPage: any;
  private loginKey: string;

  constructor(private nav: Nav, 
              private navParams: NavParams) {
                
    this.homePage = HomePage;
    this.awardsPage = AwardsPage;
    this.donatePage = DonatePage;
    this.volunteerPage = VolunteerPage;
    this.loginKey = navParams.get('key');
    if ( this.loginKey === undefined ) this.login();
  }

  login() {
    this.nav.push(LogonPage);
  }
}
