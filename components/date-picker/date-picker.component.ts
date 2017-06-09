import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { ViewController, Modal, ModalController, NavParams } from 'ionic-angular';
import { ViewController, PopoverController, NavParams } from 'ionic-angular';
import { DatePickerCalendar } from '../date-picker-calendar/date-picker-calendar.component';
import Moment from "moment";

@Component({
  selector: 'date-picker',
  template: `
<div id="date-picker-input-container" (click)="showDatePicker($event)">
  <span class="date-picker-date-display" item-start>{{ selectedDateStr }}</span>
  <span class="date-picker-filler"></span>
  <ion-icon name="md-arrow-dropdown" isActive="false" item-end></ion-icon>
</div>
  `
})
export class DatePicker {
  @Input()
  selectedDate;
  @Input()
  minDate
  @Output()
  onDateSelected = new EventEmitter();
  selectedDateStr;
  calendar;
  constructor (private popoverCtrl: PopoverController,
               public navParams: NavParams,
               public viewCtrl: ViewController) {
    this.calendar = DatePickerCalendar;
    this.selectedDateStr = Moment(this.selectedDate).format("YYYY-MM-DD"); 
  }

  ngOnInit() {
    this.selectedDateStr = Moment(this.selectedDate).format("YYYY-MM-DD"); 
  }

  showDatePicker(clickEvent){
    let popover = this.popoverCtrl.create(this.calendar, {'selectedDate': this.selectedDate, 'minDate': this.minDate});
    popover.present();
    popover.onDidDismiss( (data) => {
      if (data) {
        let date = Moment(data);
        this.selectedDateStr = date.format("YYYY-MM-DD");
        this.selectedDate = date.format("YYYY-MM-DD");
        this.onDateSelected.emit(date.format("YYYY-MM-DD"));
      }
    })
  }
}