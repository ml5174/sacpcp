import { Component, Output, EventEmitter } from '@angular/core';
import { ViewController, ModalController, NavParams } from 'ionic-angular';
import Moment from "moment";

export class DateItem {
    isSelected: boolean;
    momentDate: Moment.Moment;
    isEnabled: boolean;
}

@Component({
  selector: 'date-picker-calendar',
  templateUrl: 'date-picker-calendar.component.html'
})
export class DatePickerCalendar {
  @Output()
  public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  public onCancelled: EventEmitter<any> = new EventEmitter<any>();

  private selectedMoment: Moment.Moment;
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  public selectedDateStr; // stores the date passed in by nav params
  public minDate;
  public today: Moment.Moment = Moment(Moment().format("YYYY-MM-DD"));
  public onCurrentMonth: Boolean = false;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.selectedDateStr = this.navParams.get("selectedDate");
    this.selectedMoment = Moment(this.selectedDateStr);
    this.minDate = this.navParams.get("minDate");
    this.renderCalender();
  }

  ngOnInit() {
    this.setSelectedDate();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.selectedMoment.year(), this.selectedMoment.month() + 1, this.selectedMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);
    this.setSelectedDate();
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = Moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
    let startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
    let endOfMonth = calendarMonth.clone().endOf("month").day("saturday");
    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1;
    let calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone();
      let dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, "day"),
        isEnabled: this.isBelongToThisMonth(immunableStartOfMonth, month)
      };
      calendarDays.push(dateItem);
    }
    return calendarDays;
  }

  private groupByWeek(daysOfMonth: DateItem[]) {
    let groupedDaysOfMonth = new Array<DateItem[]>();
    daysOfMonth.forEach((item, index) => {
      let groupIndex = Math.floor((index / 7));
      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];
      groupedDaysOfMonth[groupIndex].push(item);
    });
    return groupedDaysOfMonth;
  }

 selectDate(day: DateItem) {
    if (!day.isEnabled) return;
    if (day.momentDate.isBefore(this.today)) return;
    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false;
    }
    day.isSelected = true;
    this.selectedDateItem = day;
  }

  private setSelectedDate() {
    // set selected date to the date passed in by parent component
    let inputDate = Moment(this.selectedDateStr);
    let foundDates = this.daysOfMonth
      .filter((item: DateItem) => inputDate.isSame(item.momentDate.clone().startOf("day")));
    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }
  }

  private isBelongToThisMonth(momentDate: Moment.Moment, month: number) {
    return momentDate.month() + 1 === month;
  }

  setMonthBack() {
    // set selectedMoment back bv one month but not pass current month
    if (this.selectedMoment.isSame(this.today, "month")) return;
    this.selectedMoment.subtract(1, "month");
    this.renderCalender();
  }

  setMonthForward() {
    this.selectedMoment.add(1, "month");
    this.renderCalender();
  }

  confirmDateSelection() {
    this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate());
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}