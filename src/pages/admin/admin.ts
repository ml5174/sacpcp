import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'admin.html'
})
export class admin {
  constructor(public nav: NavController) {

  }

  back() {
    this.nav.pop();
  }

}
