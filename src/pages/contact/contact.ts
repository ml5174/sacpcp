import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform, MenuController, Nav, Select, Config } from 'ionic-angular';

@Component({
  templateUrl: 'contact.html'
})
export class ContactPage {
  mapsAppleString: string = "https://maps.apple.com/?address=5302%20Harry%20Hines%20Blvd,%20Dallas,%20TX%20%2075235,%20United%20States&ll=32.813773,-96.837554&q=5302%20Harry%20Hines%20Blvd";
  mapsGoogleString: string = "https://www.google.com/maps/place/5302+Harry+Hines+Blvd/@32.8129391,-96.8383961,17z/data=!4m6!3m5!1s0x864e9c1d2f591113:0xca55213bf944996d!4b1!8m2!3d32.8142175!4d-96.8373807";
  mapsURL: string = this.mapsGoogleString;
  constructor(
    public platform: Platform, 
    public nav: NavController) {
    if(this.platform.is('ios')) {
      this.mapsURL = this.mapsAppleString;
    }
  }

  back() {
    this.nav.pop();
  }

}
