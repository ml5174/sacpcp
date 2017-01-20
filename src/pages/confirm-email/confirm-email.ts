import { Component } from '@angular/core'
import { UserServices } from '../../lib/service/user';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'confirm-email.html'
})
export class ConfirmEmailPage {
  constructor(public nav: NavController,
    public userServices: UserServices) {
  }
}
