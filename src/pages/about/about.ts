import { Component } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(private nav: NavController) {

  }

  back() {
    this.nav.pop();
  }

}
