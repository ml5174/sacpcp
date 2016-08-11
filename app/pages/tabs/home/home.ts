import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/tabs/home/home.html'
})
export class HomePage {
  search: boolean = false;
  previousevents: boolean = true;
  yourevents: boolean = true;
  constructor(private navCtrl: NavController) {}
  onCancel(event: any) {
    this.search=false;
  }
}
