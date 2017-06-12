import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { ViewController, Modal, ModalController, NavParams } from 'ionic-angular';
import { ViewController, PopoverController, NavParams } from 'ionic-angular';
import { DatePickerCalendar } from '../date-picker-calendar/date-picker-calendar.component';
import Moment from "moment";

@Component({
  selector: 'date-picker',
  template: `
<div id="date-picker-input-container" (click)="showDatePicker($event)">
  <span class="date-picker-label" item-start>{{ label }}: </span>
  <span class="date-picker-date-display">{{ selectedDateMoment.format("MM-DD") }}</span>
  <span class="date-picker-filler"></span>
  <ion-icon name="md-arrow-dropdown" isActive="false" item-end></ion-icon>
</div>
  `
})
export class DatePicker {
  @Input()
  selectedDate;
  @Input()
  minDate;
  @Input()
  label;
  @Output()
  onDateSelected = new EventEmitter();
  selectedDateStr;
  selectedDateMoment;
  calendar;
  constructor (private popoverCtrl: PopoverController,
               public navParams: NavParams,
               public viewCtrl: ViewController) {
    this.calendar = DatePickerCalendar;
    this.selectedDateStr = Moment(this.selectedDate).format("YYYY-MM-DD"); 
    this.selectedDateMoment = Moment(this.selectedDate);
  }

  ngOnInit() {
    this.selectedDateStr = Moment(this.selectedDate).format("YYYY-MM-DD");
    this.selectedDateMoment = Moment(this.selectedDate);
  }

  showDatePicker(clickEvent){
    let popover = this.popoverCtrl.create(this.calendar, {'selectedDate': this.selectedDate, 'minDate': this.minDate});
    popover.present();
    popover.onDidDismiss( (data) => {
      if (data) {
        let date = Moment(data);
        this.selectedDateStr = date.format("YYYY-MM-DD");
        this.selectedDate = date.format("YYYY-MM-DD");
        this.selectedDateMoment = date;
        this.onDateSelected.emit(date.format("YYYY-MM-DD"));
      }
    })
  }
}