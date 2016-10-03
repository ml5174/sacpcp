import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEvent} from '../../../model/volunteer-event';
import {VolunteerEventsService} from '../../../service/volunteer-events-service';
import { Observable } from 'rxjs/Observable';
import {LogonPage} from '../../logon/logon';
import {AppHeaderComponent} from '../../../components/app-header.component';
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'build/pages/tabs/home/home.html',
  providers: [VolunteerEventsService],
  pipes: [TranslatePipe],
  directives: [AppHeaderComponent]
})
export class HomePage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: Array<VolunteerEvent> = [];
  selectedTab: string = "events";
  language: string = "en";
  constructor(private navCtrl: NavController,
              private nav: Nav, 
              private volunteerEventsService: VolunteerEventsService,
              private translate: TranslateService
  ) { 
  
   }
  ngOnInit(){
  //  this.getEvents();
  }
  onCancel(event: any) {
    this.search=false;
  }
  getEvents() {
    this.volunteerEventsService
        .getVolunteerEvents().subscribe(
                               events => this.events = events, 
                                err => {
                                    console.log(err);
                                });
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
    this.nav.setRoot(LogonPage);
  }
  noTabs() {
    this.nav.setRoot(HomePage);
  }
}
