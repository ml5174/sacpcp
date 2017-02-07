import { ViewController } from 'ionic-angular';
import { Component, Input} from '@angular/core';
import { EventPage } from '../pages/events/events';

@Component({
  template: `
              <h4 class="header">
                  Sort Options
              </h4>
                <ion-list radio-group [(ngModel)]="sortBy">
                  <ion-item>
                    <ion-label>Event Name</ion-label>
                    <ion-radio value="title" checked></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>City</ion-label>
                    <ion-radio value="location_city"></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>State</ion-label>
                    <ion-radio value="location_state"></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>Start Time</ion-label>
                    <ion-radio value="start"></ion-radio>
                  </ion-item>
              </ion-list> 
        <button ion-button ion-icon-left small class="header"  (click)="doSubmit(sortBy)">
        <ion-icon name="checkmark"> </ion-icon>
        Submit</button>
    `,
    selector:'eventsortpopover'
})

export class EventSortPopover {
  private sortBy: string = 'title';

  private modaldata;
  
  constructor(public viewCtrl: ViewController ) {

    this.viewCtrl = viewCtrl;
    this.modaldata = {};
  }

  
   doSubmit(value){
       if(value != null || value != undefined){
           this.sortBy = value;
        }
       
       this.modaldata = {'sortBy':this.sortBy};
    this.viewCtrl.dismiss(
    this.modaldata
    );
   }
  
}

