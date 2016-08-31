import {Component, ViewChild} from '@angular/core';
import {HomePage} from './home/home';
import {AwardsPage} from './awards/awards';
import {DonatePage} from './donate/donate';
import {VolunteerPage} from './volunteer/volunteer';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {RegisterIndividualProfilePage} from '../register-individual-profile/register-individual-profile';
import {LogonPage} from '../logon/logon';
import {LoginServices} from '../../service/login';
import {UserProfile} from '../../model/user-profile'

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
  private profile: UserProfile;

  constructor(private nav: Nav, 
              private navParams: NavParams,
              private loginServices: LoginServices) {
                
    this.homePage = HomePage;
    this.awardsPage = AwardsPage;
    this.donatePage = DonatePage;
    this.volunteerPage = VolunteerPage;

    this.loginKey = navParams.get('key');
    if (!this.loginKey) this.login();
  }

  ngOnInit(){
    this.getUserProfile();
  }
  getUserProfile() {
    this.loginServices
        .getUser(this.loginKey).subscribe(
                               profile => {
                                 this.profile = profile;
                                 console.log(profile.toString())
                                }, 
                                err => {
                                    console.log(err);
                                    this.handleUserProfileError(err);
                                });
  }
  handleUserProfileError(error) {
    if (error.detail) {
      if (error.detail==='Not found.') this.nav.push(RegisterIndividualProfilePage);
      if (error.detail=== 'Authentication credentials were not provided.' ) this.login();
    }
  }
  login() {
    this.nav.push(LogonPage);
  }
}
