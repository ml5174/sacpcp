import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserServices } from '../../../lib/service/user';
import { VolunteerEventsService } from '../../../lib/service/volunteer-events-service';
import { ModalController, Content } from 'ionic-angular';
import { Message } from './message';
import { OrganizationServices } from '../../../lib/service/organization';
import {MessageTargetList } from '../../../lib/components/message-target-list/message-target-list';

@Component({
  templateUrl: 'contact-volunteers.html'
})
export class ContactVolunteers implements AfterViewInit {
  
  constructor(public nav: NavController,
    public userServices: UserServices,
    public volunteerEventsService: VolunteerEventsService,
    public organizationService: OrganizationServices,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController) {

  }

  @ViewChild(MessageTargetList) messageTargetList: MessageTargetList;
  @ViewChild(Content) content: Content;

  public sendTo: string;
  public users: Array<any> = [];
  public getUsersError: Boolean;
  public selectAllUsers: Boolean;
  public events: Array<any> = [];
  public getEventsError: Boolean;
  public selectAllEvents: Boolean;
  public selectAllGroups: boolean;
  public groups: Array<any> = [];

  ngOnInit() {
     this.sendTo = 'individual';
  }

  back() {
    this.nav.pop();
  }

  scrollToTop () {
    this.content.scrollToTop();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();                                                    
  }

  ngAfterViewInit(): void {
    //throw new Error("Method not implemented.");
  }

public canSendMessage(): boolean {
    return this.messageTargetList && this.messageTargetList.areSomeChecked();
}

openMessageModal() {
      let myList = this.messageTargetList.listingsArray.controls.map( control => control.value).filter(item => item.sendto == true);
      console.log("openmessagemodal listItems: " + JSON.stringify(myList));
      ;
      let modal = this.modalCtrl.create(Message,
        {
          listType: this.sendTo,
          list: myList
        });
      modal.present();
      modal.onDidDismiss(
        res => { if (!res.cancel) {
                     this.presentToast('Sent message to selected volunteer(s).');
                     this.messageTargetList.toggleSelectAll(false);
                     this.scrollToTop();
                    }
                  }

      );  
  }
}
