import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'edit-event.html'
})
export class EditEvent {
  constructor(public nav: NavController) {

  }

  back() {
    this.nav.pop();
  }

}
