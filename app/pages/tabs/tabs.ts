import {Component} from '@angular/core';
import {HomePage} from './home/home';
import {AwardsPage} from './awards/awards';
import {DonatePage} from './donate/donate';
import {VolunteerPage} from './volunteer/volunteer';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  private homePage: any;
  private awardsPage: any;
  private donatePage: any;
  private volunteerPage: any;
  
  constructor() {
    this.homePage = HomePage;
    this.awardsPage = AwardsPage;
    this.donatePage = DonatePage;
    this.volunteerPage = VolunteerPage;
  }
}
