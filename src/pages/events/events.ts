import { Component, Input } from '@angular/core';
import { VolunteerEvent } from '../../lib/model/volunteer-event';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { EventImage } from '../../lib/model/eventImage';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from './eventdetail-modal';
import { EventSignupModal } from './eventsignup_modal';
import { ModalController, ViewController } from 'ionic-angular';
import { PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { OpportunityPipe } from '../../lib/pipe/eventsortpipe';
import { PreferencePipe } from '../../lib/pipe/eventsortpipe';
import { ParseTimePipe } from '../../lib/pipe/moment.pipe';
import { AlertController, NavController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { SignupAssistant } from '../../lib/service/signupassistant';
import Moment from "moment";
import { Nav, InfiniteScroll, Events } from 'ionic-angular';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import { LoginPage } from '../login/login';
import { RegisterLoginPage } from '../register-login/register-login';
import { Platform } from 'ionic-angular';
import { APPLE_MAP_QUERY } from '../../lib/provider/config';
import { GOOGLE_MAP_QUERY } from '../../lib/provider/config';
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';
import { MONTH_NAMES } from '../../lib/provider/eventConstants';

@Component({
  templateUrl: 'events.html',
  selector: 'events',
  providers: [ParseTimePipe, OpportunityPipe, PreferencePipe, OrganizationServices]
})

export class EventPage {
  @Input() category: string;
  @Input() newCategories: string;
  @Input() urgentCategories: string;
  public infiniteScroll: InfiniteScroll;
  private oppType;
  public loadingOverlay;
  eventDetail: EventDetail;
  public search: boolean = false;
  public events: Array<VolunteerEvent> = [];
  public searchedEvents: Array<VolunteerEvent> = [];
  public displayedEvents: Array<VolunteerEvent> = [];
  public filteredEvents: Array<VolunteerEvent> = [];
  public maxEvents: Array<VolunteerEvent> = [];
  public minEvents: Array<VolunteerEvent> = [];
  public stubEvents: Array<VolunteerEvent> = [];

  // public preferenceModel: Array<MyPreferences> = [];
  // public currentPreferences: Array<MyPreferences> = [];
  // public selectedSort: string = '';
  public image: Array<EventImage>;
  public val: string = "";
  public values: Array<String>;
  public searching: Boolean = false;
  public noResults: Boolean = false;
  public eventDetails: VolunteerEvent;
  public showDetails: Array<Boolean> = [];

  public moreInterval = 30;
  public moreIntervalIncrease = 30;

  public eventCategories: Array<String> = [];
  public getPreferencesError = false;
  // datepicker
  public selectedStartDate;
  public selectedEndDate;
  public currentStartDate; // hold selected start date for comparison on change in onStartDateChange
  public currentEndDate; // hold selected end date for comparison on change in onEndDateChange
  public dateRangeError = false;
  public dateRangeErrorValue = "Start date can't be after end date";
  public minStartDate;
  public maxStartDate;
  // preferences
  public myPreferencesObservable;
  public myPreferences;
  public myOrganizations;
  public mapQueryStart: String;
  public mapQueryEnd: String;

  public isGroupAdmin: boolean = false;

  constructor(public volunteerEventsService: VolunteerEventsService,
    public userServices: UserServices,
    public modalCtrl: ModalController,
    public platform: Platform,
    private popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public loadingController: LoadingController,
    private parseTimePipe: ParseTimePipe,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public orgServices: OrganizationServices,
    public signupAssistant: SignupAssistant,
    public nav: Nav,
    private ev: Events,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // select today and 30 days worth of events by default
    this.selectedStartDate = Moment().format("YYYY-MM-DD");
    this.selectedEndDate = Moment().add(30, 'day').format("YYYY-MM-DD");
    this.minStartDate = Moment().format("YYYY-MM-DD");
    this.maxStartDate = Moment().add(1, 'year').format("YYYY-MM-DD");
    this.currentStartDate = this.selectedStartDate.slice();
    this.currentEndDate = this.selectedEndDate.slice();
    this.volunteerEventsService.getEventCategories().subscribe(
      data => {
        this.eventCategories = data;
        let selectedCategory: any = null;
          if ( this.category && (selectedCategory = data.find(cat => cat.name === this.category)) ) {
            this.oppType = selectedCategory.id;
        }
      },
      error => {this.getPreferencesError = true; console.log('getEventCategories error: ' + error); }
    );
    // get preferences

    this.myPreferencesObservable = this.userServices.getMyPreferences();

    this.myPreferencesObservable.subscribe({
      next: (data) => {
        this.myPreferences = data;
        this.loadEvents();
      },
      error: (errRes) => {
        // handle when user is not logged in
        if (errRes.status == 401 && errRes.statusText == "Unauthorized") {
          this.myPreferences = undefined;
          this.loadEvents()
        }
      }
    });

    this.mapQueryStart = GOOGLE_MAP_QUERY;
    this.mapQueryEnd = "'";
    if (this.platform.is('ios')) {
      this.mapQueryStart = APPLE_MAP_QUERY;
      this.mapQueryEnd = '';
    }
  }

  onStartDateChange(evt) {
    let date = Moment(evt);
    if (evt === this.currentStartDate) {
      return;
    } else {
      this.currentStartDate = evt;
      if (date.isAfter(Moment(this.selectedEndDate))) {
        this.dateRangeError = true;
        return;
      } else {
        this.dateRangeError = false;
        this.loadEvents();
      }
    }
  }

  onEndDateChange(evt) {
    let date = Moment(evt);
    if (evt === this.currentEndDate) {
      return;
    } else {
      if (date.isBefore(Moment(this.selectedStartDate))) {
        this.dateRangeError = true;
        return;
      } else {
        this.dateRangeError = false;
        this.loadEvents();
      }
    }
  }

  showLoading() {
    this.loadingOverlay = this.loadingController.create({
      content: 'Please wait...'
    });
    this.loadingOverlay.present();
  }

  hideLoading() {
    this.loadingOverlay.dismiss();
  }

  presentToast(message: string) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;

    // fake async process
    setTimeout(() => {
      let beginIndex = this.displayedEvents.length;
      let perPage = this.filteredEvents.length - this.displayedEvents.length;
      if (perPage > 10) perPage = 10;
      for (let i = beginIndex; i < perPage + beginIndex; i++) {
        this.displayedEvents.push(this.filteredEvents[i]);
      }

      infiniteScroll.complete();

      if (this.displayedEvents.length >= this.filteredEvents.length) {
        infiniteScroll.enable(false);
      }

      infiniteScroll.complete();
    }, 10);
  }

  loadEvents() {
    let now = new Date(Moment(this.selectedStartDate).hour(0).minute(0).toISOString());
    let until = new Date(Moment(this.selectedEndDate).hour(23).minute(59).toISOString());
    this.showLoading();
    this.getEventsTimeRange(now.toISOString(), until.toISOString());
  }

  showMoreEvents() {
    this.moreInterval += this.moreIntervalIncrease;
    this.loadEvents();
  }

  eventDetailGuestModal(id) {
    let eventDetailGuestPopup = this.modalCtrl.create(EventDetailModal,
      {
        "id": id,
        "registered": false,
        "guestUser": true
      });
    /*  let ev = {
        target : {
          getBoundingClientRect : () => {
            return {
              top: '200'
            };
          }
        }
      };*/
    eventDetailGuestPopup.present(/*{ev}*/);
  }

  eventDetailModal(id) {
    let eventDetailPopup = this.modalCtrl.create(EventDetailModal, {
      "id": id,
      "guestUser": false,
      "registered": this.amISignedUp(id),
      "preference_data":this.myPreferences
    });

    /*   let ev = {
     target : {
       getBoundingClientRect : () => {
         return {
           top: '200'
         };
       }
     }
       };*/
    eventDetailPopup.present(/*{ev}*/);
  }

  eventSignupModal(event_data, is_admin) {

    let eventsignupPopup = this.modalCtrl.create(EventSignupModal, {
      "event_data": event_data,
      "is_admin":is_admin,
    });

    /*   let ev = {
     target : {
       getBoundingClientRect : () => {
         return {
           top: '200'
         };
       }
     }
       };*/
    eventsignupPopup.present(/*{ev}*/);
    eventsignupPopup.onDidDismiss(data => {
      this.volunteerEventsService.loadMyEvents();
    });
  }



  onCancel(event: any) {
    this.search = false;
  }
  getItems(ev: any) {
    if (ev.target.value == undefined) {
      ev.target.value = '';
    }
    this.searching = true;
    this.noResults = false;
    this.searchedEvents = this.events;
    this.loadFirstPageOfDisplayedEvents();

    // set val to the value of the searchbar
    this.val = ev.target.value;
    this.val = this.val.trim();
    this.val = this.val.toLowerCase();
    this.values = this.val.split(" ");
    if (this.val && this.val.trim() != '') {


      /*          if(this.isPreferenceSelected(this.selectedPreferences) == 1 || this.isPreferenceSelected(this.selectedPreferences) == 2 || this.isPreferenceSelected(this.selectedPreferences) == 3 ){

            this.preferenceSearch();
              }else{ */
      for (var i = 0; i < this.values.length; ++i) {

        this.searchedEvents = this.searchedEvents.filter((item) => {
          let d = new Date(item.start);
          let month = MONTH_NAMES[d.getMonth()];
          let year = d.getUTCFullYear().toString();
          let time = this.parseTimePipe.transform(item.start.toString(), 'h:mm A');

          return ((item.description != null &&
            (item.description.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.title != null &&
              (item.title.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_name != null &&
              (item.location_name.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.id != null &&
              (item.id.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_address1 != null &&
              (item.location_address1.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_city != null &&
              (item.location_city.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_state != null &&
              (item.location_state.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_zipcode != null &&
              (item.location_zipcode.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_address2 != null &&
              (item.location_address2.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (time != null &&
              (time.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (d.getUTCDate().toString() != null &&
              (d.getUTCDate().toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (month.toString() != null &&
              (month.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (year.toString() != null &&
              (year.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
          )
        });

      }
      this.loadFirstPageOfDisplayedEvents();
      //   this.searchedEvents.map(Array, this.sortPipe.transform(this.searchedEvents, this.selectedSort));
      // this.pipe.transform(this.searchedEvents, this.selectedSort);

      //  }
      if (this.searchedEvents.length == 0) {
        this.noResults = true;
      }
    } else {
      this.searching = false;
    }
  }

  getEvents() {
    this.volunteerEventsService
      .getVolunteerEvents().subscribe(
      event => this.stubEvents = event,
      err => {
        console.log('getEvents error: ' + err);
      },
      () => {
        this.searchedEvents = this.events;
        this.loadFirstPageOfDisplayedEvents();
      });
  }

  onOppTypeChange(event) {
    this.loadFirstPageOfDisplayedEvents();
  }

  loadFirstPageOfDisplayedEvents() {
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
    let opportunityPipe: OpportunityPipe = new OpportunityPipe();
    let preferencePipe: PreferencePipe = new PreferencePipe();

    this.filteredEvents = opportunityPipe.transform(this.searchedEvents, this.oppType);
    this.filteredEvents = preferencePipe.transform(this.filteredEvents, this.myPreferences);
    this.displayedEvents = [];
    let perPage = this.filteredEvents.length;
    if (perPage > 10) perPage = 10;
    for (var index = 0; index < perPage; index++) {
      var element = this.filteredEvents[index];
      this.displayedEvents.push(element);
    }
  }

  getAdminEvents() {
    this.volunteerEventsService
      .getAdminEvents().subscribe(
      event => this.stubEvents = event,
      err => {
        console.log('getAdminEvents error: ' + err);
      },
      () => {
        this.searchedEvents = this.events;
        this.loadFirstPageOfDisplayedEvents();
      });
  }

  getEventsMax(maxTime) {
    this.volunteerEventsService
      .getVolunteerEventsMaxTime(maxTime).subscribe(
      events => this.maxEvents = events,
      err => {
        console.log('getEventsMax error: ' + err);
      });
  }
  getEventsMin(minTime) {
    this.volunteerEventsService
      .getVolunteerEventsMinTime(minTime).subscribe(
      events => this.minEvents = events,
      err => {
        console.log('getEventsMin error: ' + err);
      });
  }
  getEventsTimeRange(minTime, maxTime) {
    this.volunteerEventsService
      .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
      events => {
          this.events = events;
      }, err => {
        this.hideLoading();
        console.log('getEventsTimeRange error: '+err);
      },
      () => {
        this.searchedEvents = this.events;
        this.loadFirstPageOfDisplayedEvents();
        this.hideLoading();
        if (this.searchedEvents.length == 0) {
          this.noResults = true;
        }
      }
      );
  }
  getFutureEvents(minTime, maxTime) {
    this.volunteerEventsService
      .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
      events => this.stubEvents = events,
      err => {
        console.log('getFutureEvents error: ' + err);
      });
  }

  amISignedUp(id) {
    //we return true if there is no user logged in, this prevents the ability
    //to sign up for an event
    if (!this.userServices.user.id) {
      return true;
    }
    for (let i of this.volunteerEventsService.myEvents) {
      if (id == i.event_id) {
        return true;
      }
    }
    return false;
  }

  //TODO: pass in eventLevel for handling
  signupEventRegistration(eventData) {

        let admin = false;
        let eventType = eventData.eventexpanded.org_restriction;
        let eventId = eventData.id;

        for (let i in this.myPreferences.organizations) {
            if (this.myPreferences.organizations[i].role == 1 || this.myPreferences.organizations[i].role == 2) {
                admin = true;
            } else {
                admin = false
            }
        }
        if (eventType == 1) {

            //TODO: Event only Logic
            //IF USER is not The leader of any group

            if (!admin) {
                let confirm = this.alertCtrl.create({
                    title: '',
                    cssClass: 'alertReminder',
                    message: 'Group event sign-up is only available to Group Admins.',
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {

                            }
                        }
                    ]
                });
                confirm.present();

            } else {
                this.eventSignupModal(eventData, admin);
            }

        } else if (eventType == 0) {
            this.eventSignupModal(eventData, admin);
        } else {
            //Continue with existing logic
            this.signupAssistant.setCurrentEventId(eventId);
            this.volunteerEventsService
                .checkMyEvents(eventId).subscribe(
                res => {
                    this.signupAssistant.signupEventRegistration();
                },
                err => {
                    console.log('checkMyEvents subscribe error: ' + err);
                    // this.signupassitant.signupEventRegistration();
                    if (err._body.indexOf("Event registration is full") > 0) {
                        let confirm = this.alertCtrl.create({
                            title: '',
                            cssClass: 'alertReminder',
                            message: 'Event Registration is full. We encourage you to search for similar events scheduled.',
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: () => {}
                                }
                            ]
                        });
                        confirm.present();
                    } else {
                        let confirm = this.alertCtrl.create({
                            title: '',
                            cssClass: 'alertReminder',
                            message: 'You have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the My Profile page?',
                            buttons: [
                                {
                                    text: 'No',
                                    handler: () => {}
                                },
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        this.nav.push(RegisterIndividualProfilePage, { errorResponse: err });
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                });
        }
    }

  cancelEventRegisteration(id) {
    this.signupAssistant.cancelEventRegisteration(id);
  }

  alertUserLoginRegister(eventId) {
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertReminder',
      message: 'Only registered users can sign up for events.',
      buttons: [
        {
          text: 'Register',
          handler: () => {

            this.handleEventLoginRegister(1, eventId);
          }
        },
        {
          text: 'Login',
          handler: () => {
             this.handleEventLoginRegister(0, eventId);
          }
        }
      ]
    });
    confirm.present();
  }

    openUrgentAlert(ev: Event) {
        let alert = this.alertCtrl.create({
            title: 'Urgent Need!',
            message: 'We have an urgent need for volunteers for this event!',
            buttons: ['Close'],
            cssClass: 'urgentAlert'
        });
        alert.present();
    }

  notAuthorizedForGroupOnly(id) {
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertReminder',
      message: 'You are not eligible for this event sign up (GROUP ONLY):' + id,
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }
/***
Premise: TO redirect temporarily to either a login or registration, and then return
to events to continue signup flow.
params: flag -> 0 or 1 representing either login or register
event_id: numeric Id representing specific event,
***
*/
  private handleEventLoginRegister(flag, event_id){
      this.ev.subscribe('user-event-flow', (paramsVar) => {
          this.eventDetailModal(paramsVar)
          this.ev.unsubscribe('user-event-flow'); // unsubscribe this event
      });
      let toPage;
      if(flag === 0){
        toPage = LoginPage;
    }else{
      toPage = RegisterLoginPage;
    }
  this.navCtrl.push(toPage, {
      event_id: event_id,
      fromPage:"events"
    });
  }
}
