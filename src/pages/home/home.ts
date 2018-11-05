import {Component, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, AlertController } from 'ionic-angular';
import { ContactPage } from '../../pages/contact/contact';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { RED_KETTLE_URL } from '../../lib/provider/config';
import Moment from "moment";


declare var cordova;

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
    public alertCtrl: AlertController) {
        storage.get('lastOpened').then((time) => {
            const currentTime = new Date(time);
            const selectedStartDate = Moment().format("YYYY-MM-DD");
            const selectedEndDate = Moment().add(30, 'day').format("YYYY-MM-DD");
            let now = new Date(Moment(selectedStartDate).hour(0).minute(0).toISOString());
            let until = new Date(Moment(selectedEndDate).hour(23).minute(59).toISOString());
            this.eventService.getVolunteerEventsTimeRange(now.toISOString(), until.toISOString())
                .subscribe(events => {
                    events.forEach(event => {
                        if(new Date(event.created) > currentTime) {
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

  private redKettle() {
    this.openExternalUrl(RED_KETTLE_URL);
  }

  private openExternalUrl(url: string){

      if(this.platform.is('android') || this.platform.is('ios')){
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
