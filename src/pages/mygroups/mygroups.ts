import { Component, ViewChild } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { UserServices } from '../../lib/service/user';
import { NavController, NavParams }  from 'ionic-angular';
import { STRINGS } from '../../lib/provider/config';
import { TranslateService } from "@ngx-translate/core";
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';
import { ParentVerifyModal } from '../../modals/parent-verify-modal';
import { PhoneInput } from '../../lib/components/phone-input.component';
import { AccordionBox } from '../../lib/components/accordion-box';
import { AlertController } from 'ionic-angular';
import { CreateGroupPage } from '../create-group/create-group';
import { GroupProfilePage } from '../group-profile/group-profile';
import { EditGroupAttendancePage } from '../edit-group-attendance/edit-group-attendance';
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'mygroups',
  templateUrl: 'mygroups.html',
  providers: [ OrganizationServices ]
})

export class MyGroupsPage {
  @ViewChild(Content) content: Content;
  
  hasGroups: boolean = false;
  numberGroups = 0;
  public groups:Array<any> = [];
  public loadingOverlay; 
  public key: number;
  
  // Constructor
  constructor(public nav: NavController,
              public userServices: UserServices,
              public loadingController: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastController: ToastController,
              public storage: Storage,
              public orgServices: OrganizationServices,
              private popoverCtrl: PopoverController) 
  { 

  };

  
  ngOnInit() {
   }

  ionViewDidLoad() {    
    this.storage.get('key').then((_key) => {
      this.key = _key;

      this.loadMyGroups();
    });
  } 
  
  loadMyGroups() {
    var page = this;  
    this.orgServices.getMyOrganizations().subscribe(
      groups => {
        for(var group of groups) {
          console.log("org: " + group.name + " group: " + group.group);
          page.groups.push(group);
          page.hasGroups = true;
        } 
        this.loadMyPendingGroups();
      },
      err => {
        console.log(err);
       this.hasGroups = false;
      },
      () => {
      }
    );
  }
   
  loadMyPendingGroups() {
    var page = this;  
    this.orgServices.getMyPendingOrganizations().subscribe(
      groups => {
        for(var group of groups) {
          let tempGroup: Organization = new Organization();
          tempGroup.name = group.organization.name;
          tempGroup.group = group.organization.group;
          tempGroup.description = group.organization.description;
          tempGroup.organization_id = group.organization.id;
          tempGroup.status = 1; // 0 = Active, 1 = Pending, 2 = Inactive
          page.groups.push(tempGroup);
          page.hasGroups = true;
        }
      },
      err => {
        console.log(err);
        this.hasGroups = false;
      },
      () => {
        console.log("user has " + ((page.hasGroups) ? page.groups.length : "no") + " groups");
      }
    );
  }
  
  openGroupProfile(org_id) {
    console.log("mygroups: openGroupProfile:" + org_id);
    let data = {
      orgid : org_id
    };
    this.nav.push(GroupProfilePage, data);
  }

  openEditGroupAttendance(org_id, org_name, group_name) {
    let data = {
      orgid : org_id,
      orgname : org_name,
      groupname : group_name
    };
    this.nav.push(EditGroupAttendancePage, data);
  }

  presentToast(message: string) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  pushGroupPage()
  {
    this.nav.push(CreateGroupPage);
  }

  hideLoading() {
    this.loadingOverlay.dismiss();
  }

  back() {
    this.nav.popToRoot();
  }

}
