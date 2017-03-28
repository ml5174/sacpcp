import { Component } from '@angular/core';
import { VolunteerEvent } from '../../lib/model/volunteer-event';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { EventImage } from '../../lib/model/eventImage';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from './eventdetail-modal';
import { ModalController, ViewController, Nav, NavParams } from 'ionic-angular';
import { PopoverController, ToastController, LoadingController, Events } from 'ionic-angular';
import { PreferredSearchPopover } from '../../popover/preferredsearch-popover';
import { EventSortPopover } from '../../popover/eventsort-popover';
import { EventSortPipe } from '../../lib/pipe/eventsortpipe';
import { EditEventDetailPage } from '../../pages/admin/editEventDetail';
import { EventDetail } from '../../lib/model/event-detail';

@Component({
  templateUrl: 'events.html',
  selector: 'events',
  providers: [EventSortPipe]
})

export class EventPage {

  public loadingOverlay;

  public search: boolean = false;
  public events: Array<VolunteerEvent> = [];
  public searchedEvents: Array<VolunteerEvent> = [];
  public maxEvents: Array<VolunteerEvent> = [];
  public minEvents: Array<VolunteerEvent> = [];
  public stubEvents: Array<VolunteerEvent> = [];
  public monthNames: Array<String> = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // public preferenceModel: Array<MyPreferences> = [];
  // public currentPreferences: Array<MyPreferences> = [];
  public selectedSort: string = '';
  public selectedPreferences: any = {};
  public showAdvancedOptions: Boolean = false;
  public image: Array<EventImage>;
  public val: string = "";
  public values: Array<String>;
  public searching: Boolean = false;
  public noResults: Boolean = false;
  public eventDetails: VolunteerEvent;
  public showDetails: Array<Boolean> = [];

  public moreInterval = 30;
  public moreIntervalIncrease = 30;
  public eventDetail: EventDetail;
  public signedUp: Boolean = false;
  public volunteerEvents: Array<VolunteerEvent> = [];
  constructor(public volunteerEventsService: VolunteerEventsService,
    public userServices: UserServices,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public loadingController: LoadingController,
    private sortPipe: EventSortPipe,
    public toastController: ToastController,
    public nav: Nav,
    public navParams: NavParams, ) {
  }

  ngOnInit() {

    this.loadEvents();
    // this.getPreferences();
    this.showLoading();
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

  loadEvents() {

    let now = new Date();
    let until = new Date();
    let future = new Date();
    until.setDate(now.getDate() + this.moreInterval);
    future.setDate(until.getDate() + this.moreInterval);
    this.getEventsTimeRange(now.toISOString(), until.toISOString());
    this.getFutureEvents(until.toISOString(), future.toISOString());

    //Temporarily disabling admin call until I get more GET_EVENT_DETAILS_URI
    //upon re-enabling, will need to be modified to utilize above call//

    /*
    if (this.userServices.isAdmin()) {
      //check account for admin status
      console.log("User is admin");
      this.getAdminEvents();
      //if they have admin status load admin view of events
    }
    else {
      this.getEvents();
    }
    */
  }

  showMoreEvents() {
    this.moreInterval += this.moreIntervalIncrease;
    this.loadEvents();
  }

  eventDetailModal(id) {

    let eventDetailModal = this.modalCtrl.create(EventDetailModal, {
      "id": id,
      "registered": this.amISignedUp(id)
    });
    eventDetailModal.present();
  }

  openEventDetail(id) {
    //console.log("open page!");
    this.getEventDetails(id);
    this.signedUp = this.amISignedUp(id)
  }

  getEventDetails(id) {
    this.volunteerEventsService
      .getAdminEventDetails(id).
      subscribe(
      event => {
        this.eventDetail = event, this.assignEventDetail(this.eventDetail)
      },
      err => {
        console.log(err);
      });

  }

  assignEventDetail(ed: EventDetail) {
    this.eventDetail = ed;
    this.nav.push(EditEventDetailPage, { eventDetailKey: this.eventDetail, "signedUp": this.signedUp });
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
    // set val to the value of the searchbar
    this.val = ev.target.value;
    this.val = this.val.trim();
    this.val = this.val.toLowerCase();
    this.values = this.val.split(" ");
    if (this.val && this.val.trim() != '') {


      if (this.isPreferenceSelected(this.selectedPreferences) == 1 || this.isPreferenceSelected(this.selectedPreferences) == 2 || this.isPreferenceSelected(this.selectedPreferences) == 3) {

        this.preferenceSearch();
      } else {
        for (var i = 0; i < this.values.length; ++i) {

          this.searchedEvents = this.searchedEvents.filter((item) => {
            let d = new Date(item.start)
            let month = this.monthNames[d.getMonth()];
            let year = d.getUTCFullYear().toString();


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
              (d.getUTCDate().toString() != null &&
                (d.getUTCDate().toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
              (month.toString() != null &&
                (month.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
              (year.toString() != null &&
                (year.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
            )
          });

        }

        this.searchedEvents.map(Array, this.sortPipe.transform(this.searchedEvents, this.selectedSort));
        // this.pipe.transform(this.searchedEvents, this.selectedSort);

      }
      if (this.searchedEvents.length == 0) {
        this.noResults = true;
      }
    } else {
      this.searching = false;
    }
  }


  //Sort Stuff ja999b
  preferenceSearch() {
    if (this.isPreferenceSelected(this.selectedPreferences) == 1) {
      this.doLocationSearch();
    }
    if (this.isPreferenceSelected(this.selectedPreferences) == 2) {
      this.doZipSearch();
    }
    if (this.isPreferenceSelected(this.selectedPreferences) == 3) {
      this.doLocationZipSearch;
    }
  }
  //Pass in flags from the popover for filter
  filterBy(EventName, City, State, StartTime) {

  }

  isPreferenceSelected(preferences) {
    preferences = this.selectedPreferences;
    let searchType = 0;

    if (preferences.eventLocations == true) {
      //get preferred event locations
      searchType = 1;
    }

    if (preferences.eventZip == true) {
      //get preferred event Zip Codes
      searchType = 2;
    }

    if (preferences.eventLocations == true && preferences.eventZip == true) {
      searchType = 3;
    }
    console.log(searchType);
    return searchType;
  }

  doZipSearch() {
    for (var i = 0; i < this.values.length; ++i) {
      this.searchedEvents = this.searchedEvents.filter((item) => {
        return (
          (item.location_zipcode != null &&
            (item.location_zipcode.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
        )
      });
    }
  }

  doLocationSearch() {
    for (var i = 0; i < this.values.length; ++i) {
      this.searchedEvents = this.searchedEvents.filter((item) => {
        return (
          (item.location_name != null &&
            (item.location_name.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
        )
      });
    }
  }

  doLocationZipSearch() {
    for (var i = 0; i < this.values.length; ++i) {
      this.searchedEvents = this.searchedEvents.filter((item) => {
        return (
          (item.location_name != null &&
            (item.location_name.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
          (item.location_zipcode != null &&
            (item.location_zipcode.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
        )
      });
    }
  }


  /* we are not displaying event pictures on the event page, this function will still be
     useful in the future for displaying pictures on the event detail view */

  /*  populateSearchedEvents(ev: VolunteerEvent[]){
      this.events = ev;
      this.searchedEvents = this.events;
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
    } */

  getEvents() {
    this.volunteerEventsService
      .getVolunteerEvents().subscribe(
      event => this.stubEvents = event,
      err => {
        console.log(err);
      },
      () => this.searchedEvents = this.events);
  }



  getAdminEvents() {
    this.volunteerEventsService
      .getAdminEvents().subscribe(
      event => this.stubEvents = event,
      err => {
        console.log(err);
      },
      () => {
        this.searchedEvents = this.events;
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
  getEventsTimeRange(minTime, maxTime) {
    this.volunteerEventsService
      .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
      events => {
        this.events = events;
      }, err => {
        this.hideLoading();
        console.log(err);
      },
      () => {
        this.searchedEvents = this.events;
        this.hideLoading();
      });
  }
  getFutureEvents(minTime, maxTime) {
    this.volunteerEventsService
      .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
      events => this.stubEvents = events,
      err => {
        console.log(err);
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
  /*
  signup(id) {
    this.volunteerEventsService
      .eventRegister(id).subscribe(
      event => {
        console.log("signed up for event " + id);
        this.presentToast("Event sign-up successful.");
      },
      err => {
        console.log(err);
        this.presentToast("Error signing up for event");
      }, () => {
        this.volunteerEventsService.loadMyEvents();
      });
  }

  deRegister(id) {
    this.volunteerEventsService
      .eventDeregister(id).subscribe(
      result => {
        console.log("canceled event registration " + id);
        this.presentToast("You are no longer signed up for this event");
      },
      err => {
        console.log(err);
        this.presentToast("Error cancelling event registration");
      }, () => {
        this.volunteerEventsService.loadMyEvents();
      });
  }
  */
  //Popover Stuff
  presentPopover(ev) {

    let popover = this.popoverCtrl.create(EventSortPopover, {
    });

    popover.present({
      ev: ev
    });

    popover.onDidDismiss(data => {
      if (data != null || data != undefined) {
        this.selectedSort = data.sortBy;

      }

    })
  }

  presentPreferences(ev) {

    let popover2 = this.popoverCtrl.create(PreferredSearchPopover, {
    });

    popover2.present({
      ev: ev
    });

    popover2.onDidDismiss(data2 => {
      if (data2 != null || data2 != undefined) {
        this.selectedPreferences = data2;
      } else {
        this.selectedPreferences = {};
      }

    })

  }
}