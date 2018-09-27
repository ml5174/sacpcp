import {Component, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { ContactPage } from '../../pages/contact/contact';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import Moment from "moment";

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  program: string = "selection";
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
        const currTime = new Date(Moment().add(1,'days').toISOString());
    storage.get('lastOpened').then((time) => { 
      eventService.getVolunteerEventsMinTime(currTime.toISOString()).subscribe(events => {
        events.forEach(event => {
          if(new Date(event.created) > new Date(time)) {
            this.newCategories[event.title].push(event.id);
          }
        })
      });
    });
  
    storage.set("lastOpened", new Date(Moment(Moment()).toISOString()));
  }
  selectEvent(eventCategory) {
    this.eventCategory = eventCategory
  }

}
