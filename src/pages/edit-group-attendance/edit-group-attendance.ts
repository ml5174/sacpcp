import { Component } from '@angular/core';
import {NavController, NavParams, ModalController } from 'ionic-angular';
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Member } from '../../lib/model/member';
import {GroupAttendeeModal} from '../../modals/group-attendee-modal';
@Component({
  selector: 'page-edit-group-attendance',
  templateUrl: 'edit-group-attendance.html',
  providers: [ OrganizationServices ]
})
export class EditGroupAttendancePage {
  public title: String = "Edit Group Attendance";
  public key: number;
  public orgid: number; 
  public orgname: String;
  public groupname: String;
  public orgMembers:Array<any> = [];
  public members:Array<Member> = [];
  public others:Array<Member> = [];
  constructor(public navCtrl: NavController, 
              public storage: Storage, 
              public alertCtrl: AlertController,   
              public orgServices: OrganizationServices, 
              public navParams: NavParams,
              public modalControl: ModalController) 
  {
  }

  ionViewDidLoad() {
    console.log('EditGroupAttendancePage ' + this.navParams.get('orgid'));
    this.orgid = this.navParams.get('orgid');
    this.orgname = this.navParams.get('orgname');
    this.groupname = this.navParams.get('groupname');
    this.title = "Edit Group " + this.orgname + " " + this.groupname + " attendance";
    this.storage.get('key').then((_key) => {
      this.key = _key;

      this.getOrganizationContacts();
    });
  }


  changeAttendingIndicator(member: Member) {
    console.log("changeAttendingIndicator " + member.first_name + " " + member.last_name);
  }

  getOrganizationContacts() { 
    this.orgServices.getOrganizationContacts(this.orgid).subscribe(
      orgcontacts => {       
        console.log("orgcontacts: " );
        for(var orgMember of orgcontacts.members) {
          console.log("member: " + orgMember);
          let member: Member = new Member();
          member.first_name = orgMember.first_name;
          member.last_name = orgMember.last_name;
          member.email = orgMember.email;
          member.mobilenumber = orgMember.mobilenumber;
          member.role = orgMember.role;
          member.isAttending = true; 
          this.members.push(member);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        //console.log("completed processing Observable getOrganizationContacts, # of members " + this.members.length);
      }
    );
  }

  cancel() {
    // for (var member of this.members)
    // { 
    //   console.log("member: " + member.first_name + " " + member.last_name + " " + member.isAttending );
    // }
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertReminder',
      message: 'Event sign-up will NOT be completed if you cancel now.<br><br> Do you still want to cancel?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            //this.nav.push(RegisterIndividualProfilePage,{errorResponse:err});
          }
        }
      ]
    });
    confirm.present();   
  }

  back() {
    this.navCtrl.pop();
  }
  
  manageAttendee(attendeeIndex: number) {
      console.log("manageAttendee");
      let attendee = (attendeeIndex >= 0) ? this.members[attendeeIndex] : new Member();
          
      let myModal = this.modalControl.create(GroupAttendeeModal, {attendee: attendee});
      myModal.onDidDismiss(data => {
          if (data) {
              console.log(data.mobilenumber);
              if(attendeeIndex >=0) {
                  this.members[attendeeIndex] = data;
              }
              else {
                  this.members.push(data);
              }
          }
          else {  //TODO: REMOVE this after testing - not needed
              console.log("No member: " + data.mobilenumber);
          }
   });      
   myModal.present();
  }     

  addAttendee() {
    console.log("edit-group-attendance: addAttendee");
  }
}
