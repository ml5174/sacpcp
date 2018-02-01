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
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

@Component({
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

  ionViewDidLoad(){
 
    let myKey: number = 21;

    this.getFromStorageStandard().then((result) => {
          myKey = result;
    });
  
    console.log("key is " + myKey);
  }
  
  getFromStorageStandard(){
  
    return this.storage.get('key');
  
  }
  

  ngOnInit() {
    console.log("mygroups: ngOnInit");
  }

  ionViewWillLoad() {
    console.log("mygroups: ionViewWillLoad");
    
    this.storage.get('key').then((_key) => {
      this.key = _key;

      this.loadMyGroups();
      console.log("groups: after loadMyGroups: " + this.groups.length); 
  
      this.loadMyPendingGroups();
      console.log("groups: after loadMyPendingGroups" + this.groups.length);
    });
  } 
  
  loadMyGroups() {
    console.log("mygroups: loadMyGropus() + " + this.groups.length);
    
    var page = this;  
    this.orgServices.getMyOrganizations().subscribe(
      groups => {
        for(var group of groups) {
          console.log("group: "+ group.name);
          page.groups.push(group);
          page.hasGroups = true;
        } 
        console.log("user has " + ((page.hasGroups) ? groups.length : "no") + " groups");
      },
      err => {
        console.log(err);
       this.hasGroups = false;
      },
      () => {
        console.log("completed processing getMyOrganizations");
      }
    );
  }
   
  loadMyPendingGroups() {
    console.log("mygroups: loadMyPendingGropus() + " + this.groups.length);
  
    var page = this;  
    this.orgServices.getMyPendingOrganizations().subscribe(
      groups => {
        for(var group of groups) {
          console.log("group: "+ group.organization.name);
          let tempGroup: Organization = new Organization();
          tempGroup.name = group.organization.name;
          tempGroup.group = group.organization.group;
          tempGroup.description = group.organization.description;
          tempGroup.organization_id = group.organization.id;
          tempGroup.status = 1; // 0 = Active, 1 = Pending, 2 = Inactive
          page.groups.push(tempGroup);
          page.hasGroups = true;
        }
        console.log("user has " + ((page.hasGroups) ? groups.length : "no") + " pending groups");
      },
      err => {
        console.log(err);
        this.hasGroups = false;
      },
      () => {
        console.log("completed processing Observable getMyPendingOrganizations");
      }
    );
  }
  
  openGroupProfile(org_id) {
    console.log("mygroups: openGroupProfile");
    console.log("mygroups: openGroupProfile:" + org_id);
    let data = {
      orgid : org_id
    };
    this.nav.push(GroupProfilePage, data);
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
