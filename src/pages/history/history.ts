import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppInfoPage } from '../app-info/app-info';

@Component({
  templateUrl: 'history.html',
})
export class HistoryPage {
  constructor(public nav: NavController, public navParams: NavParams) {
  }

  openAppInfo() {
     console.log('About Us: openAppInfo');
     this.nav.push(AppInfoPage);
  }
    

}
