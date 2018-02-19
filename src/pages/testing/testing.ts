import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import {EditGroupAttendancePage} from '../edit-group-attendance/edit-group-attendance';
import {GroupAttendeeModal} from '../../modals/group-attendee-modal';
import {Member} from '../../lib/model/member';

@Component({
  templateUrl: 'testing.html'
})
export class TestingPage {
  serverVersionNumber: string = "1.700";
  versionNumber: string = "";
  buildNumber: string = "";
  versionString: string = "";
  serverEnv: string = "test";

  constructor(
    public modalControl: ModalController) {
    
  }
  public openEditGroupAttendance() {
     console.log("openEditGroupAttendance");
      let attendee = new Member();
      attendee.first_name = "Peter";
      attendee.last_name = "Smith";
      attendee.isAttending = false;
      attendee.ext_id = "435";
      attendee.contactString = "barndancer@square.com";
      let myModal = this.modalControl.create(EditGroupAttendancePage);
      myModal.onDidDismiss(data => {
         console.log(data);
   });      
   myModal.present();     
  }

  public openBasicModal() {
      console.log("openBasicModal");
      let attendee = new Member();
      attendee.first_name = "Peter";
      attendee.last_name = "Smith";
      attendee.isAttending = false;
      attendee.ext_id = "435";
      attendee.contactString = "barndancer@square.com";
      let myModal = this.modalControl.create(GroupAttendeeModal, {attendee: attendee});
      myModal.onDidDismiss(data => {
         console.log(data);
   });      
   myModal.present();
  }
  
}
