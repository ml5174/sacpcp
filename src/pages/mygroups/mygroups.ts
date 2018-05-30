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
import { sortOrganization } from '../../lib/model/organization';

@Component({
  selector: 'mygroups',
  templateUrl: 'mygroups.html',
  providers: [ OrganizationServices ]
})

export class MyGroupsPage {
  @ViewChild(Content) content: Content;
  
  isGroupLoadingComplete: boolean = false;
  hasApprovedGroups: boolean = false;
  hasPendingGroups: boolean = false;
  numberGroups = 0;
  public groups:Array<any> = [];
  public loadingOverlay; 
  public key: number;
  
  constructor(public nav: NavController,
              public userServices: UserServices,
              public loadingController: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastController: ToastController,
              public storage: Storage,
              public orgServices: OrganizationServices,
              private popoverCtrl: PopoverController) 
  {  };

  ngOnInit() {
    if (this.userServices.user.id) {
        this.key = this.userServices.user.id;
    }
    else {
        this.storage.get('key')
            .then(key => this.key = key)
            .catch(err => console.log("couldn't get key for authentication"));
    }   }

  ionViewDidLoad() {    
      this.loadMyGroups();
  } 
  
  loadMyGroups() {
    console.info("loadMyGroups() start");
    var page = this; 
    // 
    page.orgServices.getMyOrganizationsList().merge(page.orgServices.getMyOrgsFromOrgRequestsList()).subscribe(
      group => {
          console.log("loadMyGroups() group: " + JSON.stringify(group));
          if(group.org_status == null) {
             group.org_status = 1; 
          }
          page.groups.push(group);
      },
      err => {
        console.log(err);
      },
      () => {
        page.groups.sort(sortOrganization);
        this.isGroupLoadingComplete = true;
      }

    );
  }
  
  openGroupProfile(org_id, approval_status) {
    console.log("mygroups: openGroupProfile:" + org_id + "; approval_status: " + approval_status);
    let data = {
      orgid : org_id,
      approval_status: approval_status
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
