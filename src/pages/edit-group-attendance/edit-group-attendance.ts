import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-edit-group-attendance',
  templateUrl: 'edit-group-attendance.html',
  providers: [ OrganizationServices ]
})
export class EditGroupAttendancePage {
  public title: String = "Edit Group Attendance";
  public key: number;
  public orgid: number; 
  public members:Array<any> = [];
  constructor(public navCtrl: NavController, 
              public storage: Storage, 
              public alertCtrl: AlertController,   
              public orgServices: OrganizationServices, 
              public navParams: NavParams) 
  {
  }

  ionViewDidLoad() {
    this.orgid = this.navParams.get('orgid');
    this.title = "Edit Group " + this.navParams.get('orgid') + " attendance";
    this.storage.get('key').then((_key) => {
      this.key = _key;

      this.getOrganizationContacts();
    });
    console.log('EditGroupAttendancePage ' + this.navParams.get('orgid'));
  }


  getOrganizationContacts() {
    var page = this;  
    this.orgServices.getOrganizationContacts(this.orgid).subscribe(
      orgcontacts => {       
        console.log("orgcontacts: " );
        for(var member of orgcontacts.members) {
          console.log("member: " + member);
          page.members.push(member);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log("completed processing Observable getOrganizationContacts");
      }
    );
  }

  cancel() {
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
}
