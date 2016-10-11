import { Component } from '@angular/core';
import { UserServices } from '../service/user';
import { Storage } from '@ionic/storage';
import { Nav } from 'ionic-angular';
import {LoginPage} from '../pages/login/login';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html'
})

export class AppHeaderComponent {
  //To check whether user is logged in or not. Also trigger any language prefs for the menu here.
  storage: Storage = new Storage();
  username: string = '';
  key: any = { key: 'key' };
  constructor(
              private nav: Nav
              ) {
    this.storage.get('username')
      .then(
      value => {
        if (value) this.username = value
      }
      );
  }
  login() {
   this.nav.setRoot(LoginPage);
  }
}