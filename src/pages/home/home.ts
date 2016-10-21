import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {VolunteerEvent} from '../../model/volunteer-event';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {EventImage} from '../../model/eventImage';
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

homeSlideOptions = {
loop: true, 
pager: true, 
autoplay: 3000};

  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  events: Array<VolunteerEvent> = [];
  searchedEvents: Array<VolunteerEvent> = [];
  maxEvents: Array<VolunteerEvent> = [];
  minEvents: Array<VolunteerEvent> = [];
  locations: Array<Locations> = [];
  image: Array<EventImage>;
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
  getItems(ev: any) {
    this.searchedEvents = this.events;
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.searchedEvents = this.events.filter((item) => {
        return ((item.description.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }

  }
  populateSearchedEvents(ev: VolunteerEvent[]){
    this.events = ev;
    this.searchedEvents = this.events;
    console.log(this.searchedEvents);
    for (let event of this.events) {
     this.volunteerEventsService
        .getEventImage(event.id).subscribe(
                               image => {this.image = image;
                                         event.image = this.image;
                                         if(this.image.length==0){
                                            this.image[0] = new EventImage();
                                            event.image = this.image;};
                                        }, 
                                err => {
                                    console.log(err);
                                }, 
                                () => this.searchedEvents = this.events);
    }
  }
  getEvents() {
    this.volunteerEventsService
        .getVolunteerEvents().subscribe(
                               event => this.events = event, 
                                err => {
                                    console.log(err);
                                }, 
                                () => {this.searchedEvents = this.events
                                       this.populateSearchedEvents(this.events)});
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
