import { Component } from '@angular/core'
import { UserServices } from '../../service/user';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'password-updated.html'
})
export class PasswordUpdatedPage {
  constructor(private nav: NavController,
    private userServices: UserServices) {
  }
}
