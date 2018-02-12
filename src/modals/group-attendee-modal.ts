import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {Member} from '../lib/model/member';

@Component({
  templateUrl: 'group-attendee-modal.html'
})
export class GroupAttendeeModal {
  //attendee : Member;
  tmp: string;

  constructor(public viewController: ViewController, public params: NavParams) {
        console.log("Constructor");
        this.tmp = params.get('attendee');
    }
dismiss() {
    this.viewController.dismiss();
  }
}