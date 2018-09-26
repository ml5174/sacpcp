import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppInfoPage } from '../../pages/app-info/app-info';

@Component({
  selector: 'privacy-terms-content',
  templateUrl: 'privacy-terms-content.html'
})

export class PrivacyTermsContent { 

  constructor(
    public nav: NavController
  ) {
  }
    
  openAppInfo() {
    console.log('About Us: openAppInfo');
    this.nav.push(AppInfoPage);
  }
 
}