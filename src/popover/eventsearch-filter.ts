import { ViewController } from 'ionic-angular';
import { Component, Input} from '@angular/core';
import { EventPage } from '../pages/events/events';


@Component({
  template: `
              <h4>
                  Filter Options
              </h4>
                <ion-list radio-group [(ngModel)]="sortBy">
                  <ion-item>
                    <ion-label>Event Name</ion-label>
                    <ion-radio value="eventName" checked></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>City</ion-label>
                    <ion-radio value="city"></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>State</ion-label>
                    <ion-radio value="state"></ion-radio>
                  </ion-item>
                   <ion-item>
                    <ion-label>Start Time</ion-label>
                    <ion-radio value="startTime"></ion-radio>
                  </ion-item>
              </ion-list> 
              <ion-list>
        <button ion-button ion-icon-left small color="danger" (click)="doSubmit(sortBy)">
        <ion-icon name="checkmark"> </ion-icon>
        Submit</button>
        <button ion-button ion-icon-left small color="danger">
        Clear</button>
    `
})

export class EventFilterPopover {
  private sortBy: string = 'eventName';
  
  constructor(public viewCtrl: ViewController ) {

    this.viewCtrl = viewCtrl;
  }

  
   doSubmit(value){
       if(value != null || value != undefined){
           this.sortBy = value;
        }
    
       let  data = {'sortBy':this.sortBy};
    this.viewCtrl.dismiss(
    data
    );
   }
  
}

