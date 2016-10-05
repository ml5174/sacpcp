import {Component} from '@angular/core';
import { UserServices } from '../service/user';
import { Storage, LocalStorage } from 'ionic-angular';
import {NavController, Nav, NavParams} from 'ionic-angular';

@Component({
  selector: 'app-header',
  templateUrl:'build/components/app-header.component.html'
})

export class AppHeaderComponent {
//To check whether user is logged in or not. Also trigger any language prefs for the menu here.
storage: Storage = new Storage(LocalStorage);
  username: string = '';
  key: any = { key: 'key' };
  constructor() {
    this.storage.get('username')
      .then(
      value => {
        if (value) this.username = value
      }
      );
      }
  }