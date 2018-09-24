import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppInfoPage } from '../app-info/app-info';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('homeSlider') homeSlider;
  program: string = "selection";
  constructor(
    public nav: NavController,
    public storage: Storage) {
    };

    openAppInfo() {
      console.log('About Us: openAppInfo');
      this.nav.push(AppInfoPage);
    }
   
  back() {
    this.nav.pop();
  }
  switch_view(viewname){
    this.program = viewname;
    document.getElementById('programcard').scrollIntoView(true);
    
   }
  changeSlides(event) {
    if(event.getActiveIndex() == 0){
      this.homeSlider.startAutoplay(3000);
    }
  }
}
