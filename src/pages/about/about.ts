import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(public nav: NavController) {

  }

  back() {
    this.nav.pop();
  }

}
