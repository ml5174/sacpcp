import { Component, ViewChild, OnInit, OnChanges } from '@angular/core'
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
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { GroupAction } from '../../../modals/group-action/group-action';

@Component({
    templateUrl: 'groups.html'
})

export class Groups implements OnInit, OnChanges {


    @ViewChild(Content) content: Content;

    public key: string = '';
    public val: string = '';
    public errors: Array<string> = [];
    public orgs: Array<any> = [];
    public pendingOrgs: Array<any> = [];
    public loadingOverlay;
    private isAdmin = false;

    // Constructor
    constructor(public nav: NavController,
        public loadingController: LoadingController,
        public fb: FormBuilder,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public storage: Storage,
        public toastController: ToastController,
        public orgServices: OrganizationServices,
        private userServices: UserServices,
        private popoverCtrl: PopoverController) {
    }
    ngOnInit(): void {
        
        if (this.userServices.user.id) {
            this.key = this.userServices.user.id;
        }
        else {
            this.storage.get('key')
                .then(key => this.key = key)
                .catch(err => console.log("couldn't get key for authentication"));
        }
        this.isAdmin = this.userServices.user.profile.accounttype == 'A';
        this.loadOrgs();
    }

    ngOnChanges(): void {
        //this.rebuildForm();
    }

/**
 *   sort first by pending-active-inactive, then org, then group name.
 *   Pass this to sort()
 * @param a - organization but not specifying
 * @param b - same
 */
    sortOrganization(a: any, b: any) {
        if (a.approval_status == 1 && b.approval_status != 1) {
            return -1;
        }
        else if (a.approval_status != 1 && b.approval_status == 1) {
            return 1;
        }
        else if(a.status == 0 && b.status == 1) {
            return -1;
        }
        else if(a.status == 1 && b.status == 0) {
            return 1;
        }
        let nameCompare = a.name.localeCompare(b.name);
        if (nameCompare != 0) {
            return nameCompare;
        }
        else {
            return a.group.localeCompare(b.group);
        }
    }

    loadOrgs() {
        this.orgs = [];
        let page = this;
        this.orgServices.getAllGroupsForAdmin().subscribe(
            organizations => {
                //console.log("length: " + organizations.length);
                for (let org of organizations) {
                   // console.log(org);
                    if (org.name) {
                        page.orgs.push(org);
                        //console.log("org: " + org.name + " group: " + org.group);
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

    openGroupProfile(org: any) {
        console.log("admin groups: openGroupProfile:" + JSON.stringify(org.value));
        let data = {
          orgid : org.controls.id.value
        };
        this.nav.push(GroupProfilePage, data);
      }
/**
 *   For the input org, mark approved/disapproved and do stuff :)
 * @param org 
 */

    openGroupActionModal(org: any, mode: string) {
        let groupActionModal = this.modalCtrl.create(GroupAction, { org: org, mode: mode });
        groupActionModal.onDidDismiss(data => {
            if (data) {
                let action = data.action;
                let comment = data.comment;
                let groupId = data.id; // as opposed to request id which is needed for approve/decline
                if (action === "approve" || action === "decline") {
                    this.orgServices.getPendingOrgRequests().filter(x => x.organization.id == groupId).subscribe(
                        req => {
                            let toastText = "The group " + org.group + " has been " + (action === 'approve' ? "approved" : "declined") + ".";
                            let actionSubmit = (action === 'approve' ? 2 : 3)
                            this.orgServices.administerOrganization(req.id, actionSubmit).subscribe({
                                next: results => {
                                    console.log(results);
                                    this.presentToast(toastText);
                                    this.loadOrgs();
                                },
                                error: err => {
                                    console.log(err);
                                    this.presentToast("Error - please contact TSA support");
                                }
                            });
                    });
                }
                else if(action === "inactive" || action === "active") {
                    let status = (action === "active" ? 0 : 1);
                    let toastText = "The group " + org.group + " has been set to " + action + ".";
                    this.orgServices.updateOrganization(org.id, {status: status}, this.isAdmin).subscribe({
                        next: results => {
                            console.log(results);
                            this.presentToast(toastText);
                            this.loadOrgs();
                        },
                        error: err => {
                            console.log("Error: " + err);
                            this.presentToast("Error - please contact TSA support");
                        }
                    });
                }
            }
        });
        groupActionModal.present();
    }



    doGroupAction(org: FormGroup) {
        //console.log("groups: approve Group:" + org.id + " " + org.organization.name + " " + org.organization.group);
        let action = org.controls.approval_status.value
        if(action == 1) { // this is dirty -- skip when set back to pending -- should be easier way to bypass
            return;
        }

        let dialogActionText = 'Approve';

        if(action == 4) {
            dialogActionText = 'Decline';
            //config inputs
        }
        let confirm = this.alertCtrl.create({
            title: 'Group ' + dialogActionText,
            cssClass: 'alertReminder',
            message: dialogActionText + ' Group: '+ org.controls.group.value + '<br />(id: ' + 
                org.controls.id.value  + ', for Org: ' + org.controls.name.value + ')?',
                inputs: [
                    {
                        name: 'actionComment',
                        placeholder: 'Comment',
                        type: 'text'
                    }

                ],
            buttons: [
                {
                    text: 'Cancel', // set back to Pending
                    handler: () => {
                        org.controls.approval_status.setValue(1);
                        //console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.orgServices.administerOrganization(org.controls.id.value, action).subscribe(
                            results => {
                                console.log(results);
                            },
                            err => {
                                console.log(err);
                            }
                        );
                    }
                }
            ]
        });
        confirm.present();
    }
}