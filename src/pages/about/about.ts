import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppInfoPage } from '../app-info/app-info';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {

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

}
