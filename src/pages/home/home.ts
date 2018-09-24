import {Component, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../../pages/about/about';
import { ContactPage } from '../../pages/contact/contact';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import Moment from "moment";

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  program: string = "selection";
  aboutPage = AboutPage;
  contactPage = ContactPage
  eventCategory: string;
  urgentCategories: object = {'Food Service':[], 'Food Pantry':[], 'Child Care':[],
                              'Practicum Service':[], 'Red Kettle':[], 'Clothing Warehouse':[]};
  newCategories: object = {'Food Service':[], 'Food Pantry':[], 'Child Care':[],
  'Practicum Service':[], 'Red Kettle':[], 'Clothing Warehouse':[]};
  constructor(
    public storage: Storage,
    private eventService: VolunteerEventsService
  ) {
    storage.get('lastOpened').then((time) => { 
      eventService.getVolunteerEventsMinTime(currTime.toISOString()).subscribe(events => {
        events.forEach(event => {
          if(new Date(event.created) > new Date(time)) {
            this.newCategories[event.title].push(event.id);
          }
        })
      });
    });
    const nextWeek = new Date(Moment().add(8, 'days').toISOString());
    const currTime = new Date(Moment().add(1,'days').toISOString());
    eventService.getVolunteerEventsTimeRange(currTime.toISOString(), nextWeek.toISOString()).subscribe(events => {
      events.forEach(event => {
        if((event.eventexpanded.min_registered / event.eventexpanded.max_registered) < .75 ){
          this.urgentCategories[event.title].push(event.id);
        }
      });
    });
   
    storage.set("lastOpened", new Date(Moment(Moment()).toISOString()));
  }
  selectEvent(eventCategory) {
    this.eventCategory = eventCategory
  }

}
