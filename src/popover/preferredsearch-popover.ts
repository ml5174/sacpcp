import { Component} from '@angular/core';
import { ViewController,NavController} from 'ionic-angular';
import { EventPage } from '../events/events';

@Component({
  template: `
             <h4 class="header">
                Personal Preferences 
              </h4>
              <ion-list>
                <ion-item>
                    <ion-label>Event Locations</ion-label>
                    <ion-checkbox [(ngModel)]="eventLocations"></ion-checkbox>
                </ion-item>
                <ion-item>
                    <ion-label>Event Zip Code</ion-label>
                    <ion-checkbox [(ngModel)]="eventZip"></ion-checkbox>
                </ion-item>
                <ion-item>
                    <ion-label>Interested Service Areas</ion-label>
                    <ion-checkbox [(ngModel)]="serviceAreas"></ion-checkbox>
                </ion-item>
              </ion-list>
        <button ion-button ion-icon-left small color="danger" (click)="doSubmit(eventLocations, eventZip, serviceAreas)">
        <ion-icon name="checkmark"> </ion-icon>
        Submit</button>
        <button ion-button ion-icon-left small color="danger" (click)="cancel()">
        Cancel</button>
  `,
})
export class PreferredSearchPopover {
  private  eventLocations: boolean = false;
  private  eventZip: boolean = false;
  private  serviceAreas: boolean = false;
  private preferences: any[] = [];
  
    constructor (public viewCtrl: ViewController      
    ){
            this.viewCtrl = viewCtrl;
    }

   cancel(){
     this.viewCtrl.dismiss();
   } 

   doSubmit(locations, zip, areas){
     this.eventLocations = locations;
     this.eventZip = zip;
     this.serviceAreas = areas;
    
     let data = {'eventLocations':this.eventLocations,'eventZip':this.eventZip,'serviceAreas':this.serviceAreas}
     
    this.viewCtrl.dismiss(data);
  
   }
}