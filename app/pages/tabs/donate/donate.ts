import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {LogonPage} from '../../logon/logon';

@Component({
  templateUrl: 'build/pages/tabs/donate/donate.html'
})
export class DonatePage {
  language: string = "english";
  constructor(private navCtrl: NavController,
              private nav: Nav) {
  }
  
  login() {
    this.nav.setRoot(LogonPage);
  }
}
