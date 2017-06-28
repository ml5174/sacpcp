import {Component, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {VolunteerEventsService} from '../../lib/service/volunteer-events-service';
import {LoginPage} from '../login/login';
import {EventPage} from '../events/events';
import {TranslateService} from 'ng2-translate/ng2-translate';
import { UserServices } from '../../lib/service/user';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(EventPage)
  public eventPage: EventPage;

  selectedTab: string = "home";
  language: string = "en";
  subscription: Subscription;
  
  constructor(public navCtrl: NavController,
              public nav: Nav, 
              public params: NavParams, 
              public volunteerEventsService: VolunteerEventsService,
              public translate: TranslateService,
              public userServices: UserServices
  ) { 
    this.userServices = userServices;
    this.subscription = this.userServices.userIdChange.subscribe(
                    (value) => {
                                this.volunteerEventsService.loadMyEvents();
                               },
                               err => console.log(err) 
                         );
    if (params.get('tab')) {
      console.log('tab: '+params.get('tab'));
      this.selectedTab=params.get('tab');
    }                     
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeLanguage() {
    // use navigator lang if English(en) or Spanish (es)
    var userLang = this.language; 
    userLang = /(en|es)/gi.test(userLang) ? userLang : 'en';
    // set default language and language to use
    this.translate.setDefaultLang('en');
    this.translate.use(userLang);
  }
  login() {
   this.nav.push(LoginPage);
  }
  logout() {
    this.userServices.logout();
    this.volunteerEventsService.clearEvents();
    this.nav.setRoot(HomePage);
  }
  noTabs() {
    this.nav.pop();
  }
  doInfinite(infiniteScroll) {
    if (this.selectedTab == "events") {
      this.eventPage.doInfinite(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

}
