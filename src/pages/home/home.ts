import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEvent} from '../../model/volunteer-event';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {Locations} from '../../model/locations';
import { Observable } from 'rxjs/Observable';
import {LoginPage} from '../login/login';
import {TranslateService} from 'ng2-translate/ng2-translate';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';

@Component({
  templateUrl: 'home.html',
  providers: [VolunteerEventsService],
 // pipes: [TranslatePipe]
})
export class HomePage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: Array<VolunteerEvent> = [];
  maxEvents: Array<VolunteerEvent> = [];
  minEvents: Array<VolunteerEvent> = [];
  locations: Array<Locations> = [];
  selectedTab: string = "home";
  language: string = "en";
  constructor(private navCtrl: NavController,
              private nav: Nav, 
              private volunteerEventsService: VolunteerEventsService,
              private translate: TranslateService
  ) {  }
  ngOnInit(){
    this.getEvents();
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
                                +    this.volunteerEventsService
         .getLocations().subscribe(
                                locations => this.locations = locations, 
                                 err => {
                                     console.log(err);
                                 });
  }
  getEventsMax(maxTime) {
     this.volunteerEventsService
         .getVolunteerEventsMaxTime(maxTime).subscribe(
                                events => this.maxEvents = events, 
                                 err => {
                                     console.log(err);
                                 });
  }
  getEventsMin(minTime) {
     this.volunteerEventsService
         .getVolunteerEventsMinTime(minTime).subscribe(
                                events => this.minEvents = events, 
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
   this.nav.setRoot(LoginPage);
  }
  noTabs() {
    this.nav.setRoot(HomePage);
  }
}
