import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import {GroupAttendeeModal} from '../../modals/group-attendee-modal';

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

  public openBasicModal() {
      console.log("openBasicModal");
      let myModal = this.modalControl.create(GroupAttendeeModal, {attendee: "no" });
      myModal.present();
  }
}
