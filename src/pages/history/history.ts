import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  templateUrl: 'history.html',
})
export class HistoryPage {
  @ViewChild('homeSlider') homeSlider;
  constructor(public nav: NavController, public navParams: NavParams) {
  }
  changeSlides(event) {
    if(event.getActiveIndex() == 0){
      this.homeSlider.startAutoplay(3000);
    }
  }
}
