import { Component } from '@angular/core';
import { UserServices } from '../service/user';
import { Nav } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { UserProfile } from '../model/user-profile';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html'
})

export class AppHeaderComponent {
  constructor(
    private nav: Nav,
    private userServices: UserServices,
    public storage: Storage
  ) {
  }
  login() {
    this.nav.setRoot(LoginPage);
  }
  logout() {
    this.storage.set('key', undefined);
    this.userServices.user = new UserProfile();
  }
  profile() {
    this.nav.setRoot(RegisterIndividualProfilePage);
  }
}