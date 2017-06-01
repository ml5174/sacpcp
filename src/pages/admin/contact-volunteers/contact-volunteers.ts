import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserServices } from '../../../lib/service/user';
import { VolunteerEventsService } from '../../../lib/service/volunteer-events-service';
import { ModalController } from 'ionic-angular';
import { Message } from './message';

@Component({ 
  templateUrl: 'contact-volunteers.html'
})
export class ContactVolunteers {
  constructor(public nav: NavController, 
              public userServices: UserServices, 
              public volunteerEventsService: VolunteerEventsService,
              public modalCtrl:ModalController,
              public toastCtrl:ToastController) {

  }

  public sendTo:string;
  public users:Array<any> = [];
  public getUsersError:Boolean;
  public selectAllUsers:Boolean;
  public events:Array<any> = [];
  public getEventsError:Boolean;
  public selectAllEvents:Boolean;

  ngOnInit() {
    this.sendTo = 'individual';
  	this.userServices.getAllUsers().subscribe(
  		users => {
  			for(var user of users) {
          if(user.contactmethod!=null && user.first_name!='' && user.first_name!=null)
            this.users.push(user);
        }
  		},
  		err => this.getUsersError = true,
  		() => this.toggleSelectAllUsers(true)
  	);
    this.volunteerEventsService.getVolunteerEvents().subscribe(
      events => {
        this.events = events;
      },
      err => this.getEventsError = true,
      () => this.toggleSelectAllEvents(true)
    );
  }

  back() {
    this.nav.pop();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  clickedRadioButton() {
    console.log('clicked radio button');
    if(this.sendTo==='individual') {
      this.selectAllUsers = true;
      this.toggleSelectAllUsers(true);
    } else {
      this.selectAllEvents = true;
      this.toggleSelectAllEvents(true);
    }
  }

  toggleSelectAllUsers(init) {
    if(init) {
      this.selectAllUsers=true;
      for(var user of this.users) {
        user.selected = true;
      }
    } else {
      for(var user of this.users) {
        user.selected = this.selectAllUsers;
      }
    }
  }
  toggleSelectAllEvents(init) {
    if(init) {
      this.selectAllEvents=true;
      for(var event of this.events) {
        event.selected = true;
      }
    } else {
      for(var event of this.events) {
        event.selected = this.selectAllEvents;
      }
    }
  }

  checkSelected() {
    if(this.sendTo === 'individual') {
      return !this.users.some(user => user.selected);
    } else {
      return !this.events.some(event => event.selected);
    }
  }

  getSelectedUsers() {
    let selectedUsers = [];
    for(var user of this.users) {
      if(user.selected)
        selectedUsers.push(user.user);
    }
    return selectedUsers;
  }

  getSelectedEvents() {
    let selectedEvents = [];
    for(var event of this.events) {
      if(event.selected)
        selectedEvents.push(event.id);
    }
    return selectedEvents;
  }

  message() {
    let selectedUsers = this.getSelectedUsers();
    let selectedEvents = this.getSelectedEvents();
    if(this.sendTo==='individual') {
      let modal = this.modalCtrl.create(Message,
      {
        'users': selectedUsers
      });
      modal.present();
      modal.onDidDismiss(
        res => { if(!res.cancel) this.presentToast('Sent message to selected volunteer(s).') }
      );
    } else {
      let modal = this.modalCtrl.create(Message,
      {
        'events': selectedEvents
      });
      modal.present();
      modal.onDidDismiss(
        res => { if(!res.cancel) this.presentToast(res.message) }
      );
    }
  	
  }

}
