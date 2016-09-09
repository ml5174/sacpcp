import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config'

@Component({
  templateUrl: 'build/pages/confirm-email/confirm-email.html'
})
export class ConfirmEmailPage {
  constructor(private nav: NavController,
              private userServices: UserServices) {

  }

}
