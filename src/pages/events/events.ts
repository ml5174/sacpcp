import {Component} from '@angular/core';
import {VolunteerEvent} from '../../model/volunteer-event';
import {MyEvent} from '../../model/myEvent'
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {EventImage} from '../../model/eventImage';
import { UserServices } from '../../service/user';

@Component({
  templateUrl: 'events.html',
  selector: 'events'
})

export class EventPage {

  search: boolean = false;
  events: Array<VolunteerEvent> = [];
  searchedEvents: Array<VolunteerEvent> = [];
  maxEvents: Array<VolunteerEvent> = [];
  minEvents: Array<VolunteerEvent> = [];
  image: Array<EventImage>;
  val: string ="";
  values: Array<String>;
  searching: Boolean = false;
  noResults: Boolean = false;
  signedUpEvent: MyEvent;
  eventDetails: VolunteerEvent;
  
  constructor(private volunteerEventsService: VolunteerEventsService,
              private userServices: UserServices) {
  }

  ngOnInit(){
    
    if(this.userServices.isAdmin()){
      //check account for admin status
      console.log(this.userServices.user.profile.accounttype);
      this.getAdminEvents();
      //if they have admin status load admin view of events
    }
    else{
      this.getEvents();
    }
  }
  onCancel(event: any) {
    this.search=false;
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
      for (var i = 0; i < this.values.length; ++i) {
        this.searchedEvents = this.searchedEvents.filter((item) => {
          return ((item.description.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1) ||
            (item.title.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1) ||
            (item.location_name !=null &&
            (item.location_name.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_address1 !=null &&
            (item.location_address1.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_city !=null &&
            (item.location_city.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_state !=null &&
            (item.location_state.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_zipcode !=null &&
            (item.location_zipcode.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1)) ||
            (item.location_address2 !=null &&
            (item.location_address2.toLowerCase().indexOf(this.values[i].toLowerCase()) > -1))
            )});

      }
      if (this.searchedEvents.length==0){
        this.noResults = true;
      }
    } else {
      this.searching = false;
    }
  }
  populateSearchedEvents(ev: VolunteerEvent[]){
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
  }
  getEvents() {
    this.volunteerEventsService
        .getVolunteerEvents().subscribe(
                               event => this.events = event, 
                                err => {
                                    console.log(err);
                                }, 
                                () => {this.searchedEvents = this.events;
                                       this.populateSearchedEvents(this.events);
                                     });
  }
  getAdminEvents() {
    this.volunteerEventsService
        .getAdminEvents().subscribe(
                               event => this.events = event, 
                                err => {
                                    console.log(err);
                                }, 
                                () => {this.searchedEvents = this.events;
                                       this.populateSearchedEvents(this.events);
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
  signup(id){
    this.volunteerEventsService
         .eventRegister(id).subscribe(
                                event => this.signedUpEvent = event, 
                                 err => {
                                     console.log(err);
                                 }, ()=> {
                                     this.volunteerEventsService.loadMyEvents()
                                 });
  }
  amISignedUp(id){
    //we return true if there is no user logged in, this prevents the ability
    //to sign up for an event 
     if (!this.userServices.user.id){
       return true;
     }
     for (let i of this.volunteerEventsService.myEvents){
       if (id == i.event_id){
         return true;
       }
     }
       return false;
  }
  getEventDetails(id: string){

  }
}