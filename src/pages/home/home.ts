import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {LoginPage} from '../login/login';
import {TranslateService} from 'ng2-translate/ng2-translate';
import { UserServices } from '../../service/user';

@Component({
  templateUrl: 'home.html',
  providers: [VolunteerEventsService],
 // pipes: [TranslatePipe]
})
export class HomePage {

homeSlideOptions = {
loop: true, 
pager: true, 
autoplay: 3000};

  selectedTab: string = "home";
  language: string = "en";

  constructor(private navCtrl: NavController,
              private nav: Nav, 
              private volunteerEventsService: VolunteerEventsService,
              private translate: TranslateService,
              private userServices: UserServices
  ) {  }

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
  noTabs() {
    this.nav.pop();
  }

}
