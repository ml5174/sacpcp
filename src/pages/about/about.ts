import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {

  @ViewChild('homeSlider') homeSlider;
  constructor(public nav: NavController, public navParams: NavParams) {
  }
  changeSlides(event) {
    if(event.getActiveIndex() == 0){
      this.homeSlider.startAutoplay(3000);
    }
  }

}
