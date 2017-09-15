import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'contact.html'
})
export class ContactPage {
  mapsAppleString: string = "https://maps.apple.com/?address=5302%20Harry%20Hines%20Blvd,%20Dallas,%20TX%20%2075235,%20United%20States";
  mapsGoogleString: string = "https://www.google.com/maps/place/5302+Harry+Hines+Blvd,+Dallas,+TX+75235/@32.8142175,-96.8373807,17z/data=!3m1!4b1!4m5!3m4!1s0x864e9c1d2f591113:0xca55213bf944996d!8m2!3d32.8142175!4d-96.8373807";
  mapsURL: string = this.mapsGoogleString;
  constructor(
    public alertCtrl: AlertController,
    public platform: Platform, 
    public nav: NavController) {
    if(this.platform.is('ios')) {
      this.mapsURL = this.mapsAppleString;
    }
  }

  call_TSACPC(phoneNumber) {
    let confirm = this.alertCtrl.create({
      title: phoneNumber,
      message: '',
      buttons: [
      {
        text: 'Cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Dial',
        handler: () => {
          console.log('Dial clicked');
           phoneNumber = encodeURIComponent(phoneNumber);
           window.open('tel:'+phoneNumber,'_self');
        }
      }
      ]
    });
    confirm.present();
  }

  back() {
    this.nav.pop();
  }
  
  //function to open a link in a new window
  openLink(link){
    window.open(link);
  }

}
