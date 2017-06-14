import { Component } from '@angular/core';
import { VolunteerEvent } from '../../lib/model/volunteer-event';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { EventImage } from '../../lib/model/eventImage';
import { UserServices } from '../../lib/service/user';
import { EventDetailModal } from './eventdetail-modal';
import { ModalController, ViewController } from 'ionic-angular';
import { PopoverController, ToastController, LoadingController } from 'ionic-angular';
import {OpportunityPipe} from '../../lib/pipe/eventsortpipe';
import {ParseTimePipe} from '../../lib/pipe/moment.pipe';
import { AlertController } from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { SignupAssistant } from '../../lib/service/signupassistant';
import Moment from "moment";
import {Nav} from 'ionic-angular';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';


@Component({
  templateUrl: 'events.html',
  selector: 'events',
  providers:[ParseTimePipe, OpportunityPipe]
})

export class EventPage {

  public loadingOverlay;
  eventDetail: EventDetail;
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

  public eventCategories:Array<String> = [];
  public getPreferencesError = false;
  // datepicker
  public selectedStartDate;
  public selectedEndDate;
  public dateRangeError = false;
  public dateRangeErrorValue = "Start date can't be after end date";
  public minStartDate;
  public maxStartDate;

  constructor(public volunteerEventsService: VolunteerEventsService,
    public userServices: UserServices,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public loadingController: LoadingController,
    private parseTimePipe: ParseTimePipe,
    public alertCtrl: AlertController,    
    public toastController: ToastController,
    public signupassitant: SignupAssistant,
    public nav: Nav
    ) {
  }

  ngOnInit() {
    // select today and 30 days worth of events by default
    this.selectedStartDate = Moment().format("YYYY-MM-DD");
    this.selectedEndDate = Moment().add(30, 'day').format("YYYY-MM-DD");
    this.minStartDate = Moment().subtract(1, 'day').format("YYYY-MM-DD");
    this.maxStartDate = Moment().add(1, 'year').format("YYYY-MM-DD");
    this.loadEvents();
    this.volunteerEventsService.getEventCategories().subscribe(
      data => this.eventCategories=data,
      error => this.getPreferencesError=true
    );
  }

  // updateSelectedStartDate(date) {
  //   this.dateRangeError = Moment(date).isAfter(this.selectedEndDate);
  //   if (date == this.selectedStartDate) return;
  //   if (this.dateRangeError) return;
  //   this.selectedStartDate = date;
  //   this.loadEvents();
  // }

  // updateSelectedEndDate(date) {
  //   this.dateRangeError = Moment(date).isBefore(this.selectedStartDate);
  //   if (date == this.selectedEndDate) return;
  //   if (this.dateRangeError) return;
  //   this.selectedEndDate = date;
  //   this.loadEvents();
  // }

  onStartDateChange(evt) {
    console.log("start date changfe", evt);
    let date = Moment(evt);
    if (date.isAfter(Moment(this.selectedEndDate))) {
      this.dateRangeError = true;
      return;
    } else {
      this.dateRangeError = false;
      this.loadEvents();
    }
  }

  onEndDateChange(evt) {
    console.log("end date changfe", evt);
        let date = Moment(evt);
    if (date.isBefore(Moment(this.selectedStartDate))) {
      this.dateRangeError = true;
      return;
    } else {
      this.dateRangeError = false;
      this.loadEvents();
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

  loadEvents() {
    let now = new Date(Moment(this.selectedStartDate).hour(0).minute(0).toISOString());
    let until = new Date(Moment(this.selectedEndDate).hour(23).minute(59).toISOString());
    this.showLoading();
    this.getEventsTimeRange(now.toISOString(), until.toISOString());
    // this.getFutureEvents(until.toISOString(), future.toISOString());

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

  showMoreEvents(){
    this.moreInterval += this.moreIntervalIncrease;
    this.loadEvents();
  }
/*
  eventDetailGuestPopup(id) {
    let eventDetailGuestPopup = this.popoverCtrl.create(EventDetailPopup, {
      "id": id,
      "registered": false,
      "guestUser": true
    }, {cssClass: 'detail-popover'});
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '200'
          };
        }
      }
    };
    eventDetailGuestPopup.present({ev});
  }
 
   eventDetailPopup(id){
    let eventDetailPopup = this.popoverCtrl.create(EventDetailPopup, {
      "id": id,
      "guestUser": false,
      "registered": this.amISignedUp(id)
    }, {cssClass: 'detail-popover'});

    let ev = {
  target : {
    getBoundingClientRect : () => {
      return {
        top: '200'
      };
    }
  }
};
    eventDetailPopup.present({ev});
  }
*/

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

   eventDetailModal(id){
    let eventDetailPopup = this.modalCtrl.create(EventDetailModal, {
      "id": id,
      "guestUser": false,
      "registered": this.amISignedUp(id)
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


 
  onCancel(event: any) {
    this.search = false;
  }
 getItems(ev: any) {
   
    if(ev.target.value == undefined){
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


/*          if(this.isPreferenceSelected(this.selectedPreferences) == 1 || this.isPreferenceSelected(this.selectedPreferences) == 2 || this.isPreferenceSelected(this.selectedPreferences) == 3 ){
         
      this.preferenceSearch();
        }else{ */
              for (var i = 0; i < this.values.length; ++i) {
                
                    this.searchedEvents = this.searchedEvents.filter((item) => {
                    let d = new Date(item.start);
                    let month = this.monthNames[d.getMonth()];
                    let year  = d.getUTCFullYear().toString();
                    let time = this.parseTimePipe.transform(item.start.toString(), 'h:mm A');
                   
                      return ((item.description !=null &&
                        (item.description.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                         (item.title !=null &&
                        (item.title.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))  ||
                        (item.location_name !=null &&
                        (item.location_name.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))  ||
                        (item.id !=null &&
                        (item.id.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))  ||
                        (item.location_address1 !=null &&
                        (item.location_address1.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (item.location_city !=null &&
                        (item.location_city.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (item.location_state !=null &&
                        (item.location_state.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (item.location_zipcode !=null &&
                        (item.location_zipcode.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (item.location_address2 !=null &&
                        (item.location_address2.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (time !=null &&
                        (time.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))||
                        (d.getUTCDate().toString() !=null &&
                        (d.getUTCDate().toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))||
                        (month.toString() !=null &&
                        (month.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
                        (year.toString() !=null &&
                        (year.toString().toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
                        )});

                  }

                 //   this.searchedEvents.map(Array, this.sortPipe.transform(this.searchedEvents, this.selectedSort));
                 // this.pipe.transform(this.searchedEvents, this.selectedSort);

     //  }
      if (this.searchedEvents.length==0){
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
    console.log("calling get events time range");
    this.volunteerEventsService
      .getVolunteerEventsTimeRange(minTime, maxTime).subscribe(
        events => {
          console.log("evnets returned", events);
          this.events = events;
        }, err => {
          this.hideLoading();
          console.log(err);
        },
        () => {
          console.log("last function", this.events);
          this.searchedEvents = this.events;
          this.hideLoading();
          if (this.searchedEvents.length == 0) {
            console.log("last function no events");
            this.noResults = true;
          }
          console.log("final function ends");
        }
      );
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
     
   
    signupEventRegistration(id) {
        this.signupassitant.setCurrentEventId(id);
        this.volunteerEventsService
            .checkMyEvents(id).subscribe(
            res => {  
                this.signupassitant.signupEventRegistration();
            },
            err => {
                console.log(err);
                if(err._body.indexOf("Event registration is full") > 0){
                  let confirm = this.alertCtrl.create({
                        title: '',
                        cssClass: 'alertReminder',
                        message: 'Event Registration is full. We encourage you to search for similar events scheduled.',
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {
                                    console.log('Ok, clicked');
                                }
                            }
                        ]
                    });
                    confirm.present();
                }else{
                  let confirm = this.alertCtrl.create({
                          title: '',
                          cssClass: 'alertReminder',
                          message: 'You have not filled in all of the required information to sign up for an event. <br><br> Would you like to navigate to the About Me page?',
                          buttons: [
                              {
                                  text: 'No',
                                  handler: () => {
                                      console.log('No clicked');
                                  }
                              },
                              {
                                  text: 'Yes',
                                  handler: () => {
                                      console.log('Yes clicked');
                                      this.nav.push(RegisterIndividualProfilePage,{errorResponse:err});
                                  }
                              }
                          ]
                  });
                  confirm.present();
                }
            });      
    }
   
    cancelEventRegisteration(id) {      
        this.signupassitant.cancelEventRegisteration(id);     
    }
}