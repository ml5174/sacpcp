import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {Member} from '../lib/model/member';

@Component({
  templateUrl: 'group-attendee-modal.html'
})
export class GroupAttendeeModal {
  attendee : Member;
  tmp: string;

  constructor(public viewController: ViewController, public params: NavParams) {
      //let temp = params.get('attendee');
     // this.attendee = params.get('attendee');
      //  console.log("Passed param: " + temp.first_name);
        this.attendee = (params.get('attendee')) ? params.get('attendee') : new Member();
    }
dismiss() {
    this.viewController.dismiss();
  }
  
save() {
    console.log('During Save' + this.attendee);
    let data = this.attendee;
    this.viewController.dismiss(data);
    
}  
  
}