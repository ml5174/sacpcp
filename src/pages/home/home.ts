import {Component, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, AlertController } from 'ionic-angular';
import { ContactPage } from '../../pages/contact/contact';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { RED_KETTLE_URL } from '../../lib/provider/config';
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
    private eventService: VolunteerEventsService,
    public platform: Platform,
    public alertCtrl: AlertController
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

  redKettle() {
    this.openExternalUrl(RED_KETTLE_URL);
  }

  private openExternalUrl(url: string){

      if(this.platform.is('android') && this.platform.is('ios')){
        let okayToLeaveApp = this.alertCtrl.create({
         title: '',
         cssClass: 'alertReminder',
         message: 'You are about to leave the app and visit the '+ url +' website. NOTE: The website has a separate login.',
         buttons: [
           {
             text: 'OK',
             handler: () => {
               console.log('Okay clicked');
               if (cordova && cordova.InAppBrowser) {
                 cordova.InAppBrowser.open(url, '_system');
               } else {
                 window.open(url, '_system');
               }
             }
           }
         ]
       });
       okayToLeaveApp.present();

     }else{
       let okayToLeaveApp = this.alertCtrl.create({
        title: '',
        cssClass: 'alertReminder',
        message: 'You are about to leave the app and visit '+ url +' website. NOTE: The website has a separate login.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
                window.open(url, '_system');
            }
          }
        ]
      });
      okayToLeaveApp.present();

     }
    }

}
