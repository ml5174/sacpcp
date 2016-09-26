import {Component, ViewChild} from '@angular/core';
import {HomePage} from './home/home';
import {AwardsPage} from './awards/awards';
import {DonatePage} from './donate/donate';
import {EventsPage} from './events/events';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {RegisterIndividualProfilePage} from '../register-individual-profile/register-individual-profile';
import {LogonPage} from '../logon/logon';
import {UserServices} from '../../service/user';
import {UserProfile} from '../../model/user-profile';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  providers: [LogonPage]
})
export class TabsPage {
  private homePage: any;
  private awardsPage: any;
  private donatePage: any;
  private eventsPage: any;
  private loginKey: string;
  private username: string;
  private profile: UserProfile;
  private errors: Array<string> = [];

  constructor(private nav: Nav, 
              private navParams: NavParams,
              private userServices: UserServices) {
                
    this.homePage = HomePage;
    this.awardsPage = AwardsPage;
    this.donatePage = DonatePage;
    this.eventsPage = EventsPage;

    //if (!userServices.user.id) this.login();
  }

  ngOnInit(){
    this.getUserProfile();
  }
  getUserProfile() {
    this.userServices
        .get().subscribe(
          profile => {
            this.profile = profile;
            console.log(profile.toString())
          }, 
          err => this.handleUserProfileError(err));
  }
  handleUserProfileError(error) {
    if (error.status === 400) {
      error = error.json();
      if (error.detail) {
        if (error.detail==='Not found.') this.nav.push(RegisterIndividualProfilePage);
        if (error.detail=== 'Authentication credentials were not provided.' ) this.login();
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }
  }
  login() {
    this.nav.push(LogonPage);
  }
}
