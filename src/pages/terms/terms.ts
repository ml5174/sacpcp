import { Component } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

@Component({
  templateUrl: 'terms.html'
})
export class TermsPage {
  constructor(public nav: NavController) {

  }

  back() {
    this.nav.pop();
  }

}
