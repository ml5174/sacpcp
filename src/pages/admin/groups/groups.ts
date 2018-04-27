import { Component, ViewChild } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { UserServices } from '../../../lib/service/user';
import { NavController, NavParams } from 'ionic-angular';
import { STRINGS } from '../../lib/provider/config';
import { TranslateService } from "@ngx-translate/core";
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
import { GroupProfilePage } from '../../group-profile/group-profile';

@Component({
    templateUrl: 'groups.html'
})

export class Groups {

    @ViewChild(Content) content: Content;

    public key: string = '';
    public val: string = '';
    public errors: Array<string> = [];
    public orgs: Array<any> = [];
    public pendingOrgs: Array<any> = [];
    public loadingOverlay;

    // Constructor
    constructor(public nav: NavController,
        public loadingController: LoadingController,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public storage: Storage,
        public toastController: ToastController,
        public orgServices: OrganizationServices,
        private userServices: UserServices,
        private popoverCtrl: PopoverController) {
    }

    ionViewDidLoad() {
        //console.log("Groups: ionViewDidLoad");
        if (this.userServices.user.id) {
            this.key = this.userServices.user.id;
        }
        else {
            this.storage.get('key')
                .then(key => this.key = key)
                .catch(err => console.log("couldn't get key for authentication"));
        }
        this.loadPendingOrgs();
        this.loadOrgs();
    }

    loadPendingOrgs() {
        this.pendingOrgs = [];
        var page = this;  
        this.orgServices.getOrgRequestsRequested().subscribe(
          orgs => {
            for(var org of orgs) {
              page.pendingOrgs.push(org);
              //console.log("org: " + org.organization.name + " group: " + org.organization.group);
            } 
            page.pendingOrgs.sort(this.sortPendingOrganization);
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
  }

  sortOrganization(a: any, b: any) {
    let nameCompare = a.name.localeCompare(b.name);
    if( nameCompare != 0) {
        return nameCompare;
    }
    else {
        return a.group.localeCompare(b.group);
    }
  }
  sortPendingOrganization(a: any, b: any) {
    let nameCompare = a.organization.name.localeCompare(b.organization.name);
    if( nameCompare != 0) {
        return nameCompare;
    }
    else {
        return a.organization.group.localeCompare(b.organization.group);
    }
  }


    loadOrgs() {
        this.orgs = [];
        let page = this;
        this.orgServices.getAllGroupsForAdmin().subscribe(
            organizations => {
                console.log("length: " + organizations.length);
                for (let org of organizations) {
                    console.log(org);
                    if (org.name) {
                        page.orgs.push(org);
                        console.log("org: " + org.name + " group: " + org.group);
                    }
                }
                page.orgs.sort(this.sortOrganization);
            },
            err => {
                console.log(err);
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

    openGroupProfile(org) {
        console.log("admin groups: openGroupProfile:" + JSON.stringify(org));
        let data = {
          orgid : org.id
        };
        this.nav.push(GroupProfilePage, data);
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
                                console.log("Approved: " + org.id);
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