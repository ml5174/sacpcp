import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
//import {LoginPage} from '../../login/login';

@Component({
  templateUrl: 'donate.html'
})
export class DonatePage {
  language: string = "english";
  constructor(private navCtrl: NavController,
              private nav: Nav) {
  }
  
  login() {
 //   this.nav.setRoot(LoginPage);
  }
}
