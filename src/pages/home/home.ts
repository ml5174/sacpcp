import {Component} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {LoginPage} from '../login/login';
import {TranslateService} from 'ng2-translate/ng2-translate';
import { UserServices } from '../../service/user';

@Component({
  templateUrl: 'home.html'
 // pipes: [TranslatePipe]
})
export class HomePage {

homeSlideOptions = {
loop: true, 
pager: true, 
autoplay: 3000};

  selectedTab: string = "home";
  language: string = "en";
  subscription: Subscription;
  
  constructor(private navCtrl: NavController,
              private nav: Nav, 
              private volunteerEventsService: VolunteerEventsService,
              private translate: TranslateService,
              private userServices: UserServices
  ) { 
    this.userServices = userServices;
    this.subscription = this.userServices.userIdChange.subscribe(
                    (value) => {
                                this.volunteerEventsService.loadMyEvents();
                               },
                               err => console.log(err) 
                         );}

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

}
