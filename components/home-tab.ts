import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../../pages/about/about';
import { ContactPage } from '../../pages/contact/contact';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import Moment from "moment";

@Component({
  selector: 'home-tab',
  templateUrl: 'home-tab.html',
  providers: [VolunteerEventsService]
})

export class HomeTab { 

  program: string = "selection";
  aboutPage = AboutPage;
  contactPage = ContactPage
  eventCategory: string;
  urgentCategories: object = {'Field Service':false, 'Food Pantry':false, 'Child Care':false,
                              'Practicum Service':false, 'Red Kettle':false, 'Clothing Warehouse':false};
  constructor(
    public storage: Storage,
    private eventService: VolunteerEventsService
  ) {
    // storage.get('lastOpened').then((time) => { 
    // });
    const nextWeek = new Date(Moment().add(8, 'days').toISOString());
    const currTime = new Date(Moment().add(1,'days').toISOString());
    eventService.getVolunteerEventsTimeRange(currTime.toISOString(), nextWeek.toISOString()).subscribe(events => {
      events.forEach(event => {
        if((event.eventexpanded.min_registered / event.eventexpanded.max_registered) < .75 ){
          this.urgentCategories[event.title] = true;
        }
      });
    });
    // storage.set("lastOpened", new Date(Moment(Moment()).toISOString()));
  }
   switch_view(viewname){
   this.program = viewname;
   document.getElementById('programcard').scrollIntoView(true);
   
  }
  @ViewChild('homeSlider') homeSlider;
  
  changeSlides(event) {
    if(event.getActiveIndex() == 0){
      this.homeSlider.startAutoplay(3000);
    }
  }
  selectEvent(eventCategory) {
    this.eventCategory = eventCategory
  }
}