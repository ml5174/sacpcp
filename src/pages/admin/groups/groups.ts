import {Component, ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../lib/service/user';
import {NavController,NavParams} from 'ionic-angular';
import {STRINGS} from '../../lib/provider/config';
import {TranslateService} from "@ngx-translate/core";
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';
import { ParentVerifyModal } from '../../modals/parent-verify-modal';
import { PhoneInput } from '../../lib/components/phone-input.component';
import { AccordionBox } from '../../lib/components/accordion-box';
import { AlertController } from 'ionic-angular';
import { Organization } from '../../../lib/model/organization';
import { OrganizationServices } from '../../../lib/service/organization';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'groups.html',
  providers: [OrganizationServices]
})

export class Groups {

  @ViewChild(Content) content: Content;
  
  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];
  public orgs:Array<any> = [];
  public loadingOverlay;  

  // Constructor
  constructor(public nav: NavController,
              public loadingController: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public storage: Storage,
              public toastController: ToastController,
              public orgServices: OrganizationServices,
              private popoverCtrl: PopoverController) {
  }

  

    ionViewDidLoad() {
      console.log("Groups: ionViewDidLoad");
      this.storage.get('key').then((_key) => {
        this.key = _key;
        this.loadPendingOrgs();
      });
    }

     
    loadPendingOrgs() {
      this.orgs = [];
      var page = this;  
      this.orgServices.getOrgRequestsRequested().subscribe(
        orgs => {
          for(var org of orgs) {
            page.orgs.push(org);
            //console.log("org: " + org.organization.name + " group: " + org.organization.group);
          } 
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    }
 

  presentToast(message: string) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  
  showLoading() {
    this.loadingOverlay = this.loadingController.create({
      content: 'Please wait...'
    });
    //this.loadingOverlay.present();
  }
  
  hideLoading() {
    this.loadingOverlay.dismiss();
  }
  
  cleanBooleans() {
    console.log("cleanBooleans");
  }

  clearErrors() {
    console.log("clearErrors");
    this.errors = [];

  }

  back() {
    this.nav.popToRoot();
  }

  approveGroup(org) {
    //console.log("groups: approve Group:" + org.id + " " + org.organization.name + " " + org.organization.group);

    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertReminder',
      message: 'Approve group ' + org.id + ' ' + org.organization.name + ' ' + org.organization.group + '?',
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
            /// Approve group?
            this.orgServices.approveOrganization(org.id).subscribe(
              results => {
                console.log("Approved: "+ org.id);
                var index = this.orgs.indexOf(org, 0);
                if (index > -1) {
                  this.orgs.splice(index, 1);
                }
              },
              err => {
                console.log(err);
                //
              },
              () => {
              }
            );
            //this.loadPendingOrgs();
          }
        }
      ]
    });
    confirm.present();  
  }
}