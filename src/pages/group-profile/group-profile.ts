import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, ToastController } from 'ionic-angular';

import { Organization, sortMembers } from '../../lib/model/organization';
import { AlertController } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { OrganizationServices } from '../../lib/service/organization';
import { MemberPopOver } from './member-popover';
import { HomePage } from '../home/home';
import { GroupAction } from '../../modals/group-action/group-action';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'page-group-profile',
    templateUrl: 'group-profile.html',
    providers: [OrganizationServices, MemberPopOver],
})

export class GroupProfilePage implements OnInit {

    public orgId: number = null;
    public orgData: any = null;
    public newMember: any = null;
    public invitedHere: any = [];
    private asTsaAdmin: boolean = false;  // TSA Admins can only edit pending/approve/decline and active/inactive
    public approval_status: number;
    private showSaveMessage: boolean = false;

    public canEdit: boolean = null; // crud members
    public arrayOrgTypes: any = [];
    private role: number = 0;
    public canEditOrg: boolean = false; // change org name, group name, org type - should only be allowed for group admin when group is pending
    public desktop: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public orgServices: OrganizationServices, public userServices: UserServices, public alertCtrl: AlertController,
        public modalControl: ModalController, public toastController: ToastController,
        public m: MemberPopOver) {
     }

    ngOnInit(): void {
        this.orgId = this.navParams.get('orgid');
        this.asTsaAdmin = this.navParams.get("asTsaAdmin"); // navigated to this page from TSA Admin area
        this.approval_status = this.navParams.get('approval_status') ? this.navParams.get('approval_status') : 2;
        this.role = this.navParams.get("role");
        this.loadOrgAndContacts(this.orgId);
        let page = this;
        page.orgServices.getOrgTypes().subscribe(orgTypes => {
            page.arrayOrgTypes = orgTypes;
        },
            err => {
                console.log("Unable to load organization Types in groupProfile page");
            });
    }

    public addNew() {

        if (!this.canEdit)
            return;
        let newTemplate = {
            first_name: '',
            last_name: '',
            status: 0, //Active
            role: 0,  //Member
            email: '',
            contact_method: 'Email',
            mobilenumber: null
            
        };

        let userPop = this.modalControl.create(MemberPopOver, 
            { cssClass: "member-modal", action: 'new', record: newTemplate }, 
            { cssClass: 'member-modal', enableBackdropDismiss: false });
        userPop.onDidDismiss(data => {
            if (data && data.contact_method) {

                data.showDelete = false;
                data.changed = true;
                data.new = true;
                data.isEmailSelected = false;
                data.isPhoneSelected = false;
                if (data.contact_method == 'Email') { data.isEmailSelected = true; }
                if (data.contact_method == 'Phone') { data.isPhoneSelected = true; }
                this.orgData.members.push(data); //add to members
                this.orgData.members.sort(sortMembers);
                this.showSaveMessage = true;
            }

        });
        userPop.present();
    }

    public updateExisting(member, memberIndex) {

        let page = this;
        if (!page.canEdit)
            return;

        let userPop = page.modalControl.create(MemberPopOver,
            { action: 'update', record: member },
            { cssClass: 'member-modal', enableBackdropDismiss: false });
        userPop.onDidDismiss(data => {
            if (data != null && data.delete != null && data.delete == true) {
                page.orgData.members.splice(memberIndex, 1);
                page.showSaveMessage = true;
            }
            else if (data && data.contact_method) {

                data.showDelete = false;
                data.changed = true;

                if (data.contact_method == 'Email') { data.isEmailSelected = true; }
                if (data.contact_method == 'Phone') { data.isPhoneSelected = true; }
                member.first_name = data.first_name;
                member.last_name = data.last_name;
                member.changed = true;
                member.contact_method = data.contact_method;
                member.email = data.email;
                member.status = data.status;
                member.role = data.role;
                member.mobilenumber = data.mobilenumber;
                page.showSaveMessage = true;
                page.orgData.members.sort(sortMembers);
            }
        });
        userPop.present();
    }

    public groupIsAlreadyApproved(): boolean {
        let retval: boolean = (this.orgData && this.orgData.organization && this.orgData.organization.approval_status != null && this.orgData.organization.approval_status == 1) || 
                     (this.orgData.status != null && this.orgData.status != 1);
        //console.log("groupIsAlreadyApproved: " + JSON.stringify(this.orgData) + "\n result: " + retval);
        
        return retval;
    }
/**
 *    Code for confirming leaving page (and not by Cancel or Save) in the case of having made changes
 */
    ionViewCanLeave(): boolean {
        let page = this;
        if (page.showSaveMessage) {
            let alert = this.alertCtrl.create({
                title: 'Save Changes',
                message: 'You made changes to organization.<br />Would you like to save those?',
                buttons: [
                    {
                        text: 'Discard',
                        handler: () => {
                            page.exitPage();
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: () => {}
                    },
                    {
                        text: 'Save',
                        handler: () => {
                            page.saveOrg();
                            page.exitPage();
                        }
                    }
                ]

            });
            alert.present();
            return false;
        }
        return true;
    }

    private exitPage() {
        this.showSaveMessage = false;
        this.navCtrl.pop();
    }

    public adminCount(): number {
        if (this.orgData && this.orgData.members) {
            return this.orgData.members.filter(m => m.role == 1 || m.role == 2).length;
        }
        return 0;
    }

    public userIsGroupAdmin(): boolean {
        return this.role > 0;
    }

/**
 *    orgData comes back as {organization: {}, members: []}
 *     NOTE: getOrganizationContacts will not include pending groups (for group admin) so need backup call
 *       ALSO, the user may be a group admin, a group member, or a TSA admin.
 * 
 * 
 *     TODO: FOR TSA Admin - if approved use organizationcontacts, if pending use orgrequests since org contacts doesn't have members yet (??)
 * filter(orgrequest => orgrequest.organization.id == orgId)
 */
    loadOrgAndContacts(orgId) {

        let page = this;
        if (page.asTsaAdmin && page.approval_status == 1) {
            page.orgServices.getOrgRequestsRequestedTsaAdminList().filter(orgrequest => orgrequest.organization.id == orgId).subscribe(
                orgData => {
                    page.orgData = orgData;
                    delete page.orgData.organization.description;
                    page.canEdit = false;
                    page.canEditOrg = false;
                    page.orgData.members.sort(sortMembers);
                },
                error => {                        
                    let errorText = "An error occurred while retrieving the group data.  Please contact the TSA Administrator.";
                    console.log("loadOrgAndContacts error: " + error);
                    page.presentToast(errorText);
                    page.navCtrl.pop();
            });
        }
        else if(page.approval_status == 1) {
            page.orgServices.getOrgRequestForOrg(orgId)
                    .subscribe(orgData => {
                    page.orgData = orgData;
                    delete page.orgData.organization.description;
                    page.canEdit = page.userIsGroupAdmin();
                    page.orgData.members.sort(sortMembers);
                    page.canEditOrg = page.userIsGroupAdmin() && page.approval_status == 1 && !this.asTsaAdmin;
                },
                    error => {
                        let errorText = "An error occurred while retrieving the group data.  Please contact the TSA Administrator.";
                        page.presentToast(errorText);
                        page.navCtrl.pop();

                    });
        }
        else {
            page.orgServices.getOrganizationContacts(orgId, page.asTsaAdmin).catch(
                err => page.orgServices.getAccountOrganization(orgId).map(response => ({organization: response, members: response.admins})))
                .subscribe(orgData =>{
                    page.orgData = orgData;
                    delete page.orgData.organization.description;
                    page.canEdit = page.userIsGroupAdmin();
                    page.orgData.members.sort(sortMembers);
                    page.canEditOrg = page.userIsGroupAdmin() && page.approval_status == 1 && !this.asTsaAdmin;
                },
                    error => {
                        let errorText = "An error occurred while retrieving the group data.  Please contact the TSA Administrator.";
                        page.presentToast(errorText);
                        page.navCtrl.pop();
                    });
        }
    }

/**
 *   Function needed because the members in pending orgs are formatted differently than approved orgs
 * @param member 
 */
    private formatMemberContact(member: any): string {
        let retval: string = "Not Provided";
        //console.log("formatMemberContact: " + JSON.stringify(member));
        if(member.contact_method != null) {

            retval = member.contact_method + ": " + (member.contact_method === "Email" ? member.email : member.mobilenumber);
           // console.log("retval1: " + retval);
        }
        else {
            if(member.email !== null) {
                retval = "Email: " + member.email;
            }
            else {
                retval = "Phone: " + member.mobilenumber;
            }
        }
        return retval;
    }

/**
 *   function needed because the members in pending orgs are formatted differently than approved orgs
 * @param member 
 */
    private formatMemberStatus(member: any): string {
        let retval: string = 'Not Provided';
        if(member.status != null) {
            retval = member.status == 0 ? 'Active' : 'Inactive';
        }
        else if(member.active != null) {
            retval = member.active == 1 ? 'Active' : 'Inactive';
        }
        return retval;

    }

    public adminCountValid(): boolean {
        // must have at least 1 and less than 3 members assigned as admins
        return (this.adminCount() > 0) && (this.adminCount() < 3);
    }

    public mapData(org) {
        let myorg: any = {};
        let page = this;
        if (org.organization.status != 0) {
            myorg.id = org.id;
            myorg.owner_id = org.owner_id;
            myorg.approver_id = org.approver_id;
            myorg.status = org.status;
            myorg.organization = {};
            // myorg.organization.id=org.organization.id;
            myorg.organization.name = org.organization.name;
            myorg.organization.group = org.organization.group;
            myorg.organization.status = org.organization.status;
            myorg.organization.org_type = org.organization.org_type;
            myorg.organization.website = org.organization.website;
            myorg.members = [];
            org.members.forEach(function (m) {
                let mem: any = {};
                mem.status = m.status;
                mem.first_name = m.first_name;
                mem.last_name = m.last_name;
                mem.isEmailSelected = m.isEmailSelected;
                mem.isPhoneSelected = m.isPhoneSelected;
                mem.email = m.email;
                mem.mobilenumber = (m.mobilenumber.length == 10 ? "1" + m.mobilenumber : m.mobilenumber);
                mem.role = m.role;
                if (m.ext_id) {
                    mem.ext_id = m.ext_id;
                }

                myorg.members.push(mem);
                console.log("pre-save member: " + JSON.stringify(mem));

            });
            console.log("pre-save myorg: " + JSON.stringify(myorg));
            return (myorg);
        } else {// if (org.organization.status==0) 
            myorg.members = [];
            myorg.organization = this.orgData.organization; //this field is editable by GroupAdmin
            org.members.forEach(function (m) {
                let mem: any = {};
                mem.status = m.status;
                mem.mobilenumber = (m.mobilenumber.length == 10 ? "1" + m.mobilenumber : m.mobilenumber);
                mem.first_name = m.first_name;
                mem.last_name = m.last_name;
                mem.contact_method = m.contact_method;
                mem.email = m.email;
                mem.role = m.role;
                if (m.ext_id) {
                    mem.ext_id = m.ext_id;
                }
                myorg.members.push(mem);
                console.log("pre-save mem: " + JSON.stringify(mem));
            });
            console.log("pre-save myorg: " + JSON.stringify(myorg));
            return (myorg);
        }
    }

    public saveOrg() {
        let page = this;
        if (!page.orgData)
            return;
        if (!page.adminCountValid()) {
            let alert = this.alertCtrl.create({
                title: 'One or Two Group Admin(s) Required',
                message: '<center>One or two member(s) (but no more than two) must be assigned the Admin role.</center>',
                buttons: [
                    {
                        text: 'Close'
                    }
                ]
            });
            alert.present();
            return;
        }
        page.showSaveMessage = false;
        if (!page.groupIsAlreadyApproved()) {
            let postOrg = page.mapData(page.orgData);
            console.log("new group or pending group update - putOrgReq");
            page.orgServices.putOrganizationRequest(page.orgData.id, postOrg)
                .subscribe(
                    data => {

                        console.log("Post Success - response payload: " + JSON.stringify(data));
                        
                        page.orgData.members.sort(sortMembers);
                        //page.canEdit = page.canEditCheck();

                        if (page.canEdit) {
                            page.canEditOrg = true;
                        }
                        else {
                            page.canEditOrg = false;
                        }
                        page.presentToast("Group changes have been saved.");
                        page.exitPage();
                    },
                    err => {
                        console.log(err);
                    });
        }

        else { // group already approved
            if (page.asTsaAdmin) {  // for an approved group, the TSA Admin can only change Active/Inactive, which used the admin/organizations API
                page.orgServices.updateOrganization(page.orgData.organization.id, page.orgData.organization, true).subscribe(
                    data => {
                        page.orgData.organization = data;
                        page.presentToast("Group changes have been saved.");
                        page.navCtrl.pop();
                },
                    err => {console.log(err)}
                )
            }
            else {
                page.orgData.members.forEach(member => { //phone number formatting for API acceptance
                    if (member.mobilenumber && member.mobilenumber.length == 10) {
                        member.mobilenumber = "1" + member.mobilenumber;
                    }
                });
                console.log("putOrgContactsRequest:\n" + JSON.stringify(page.orgData));
                // need to use two API calls -- one for members and one for active/inactive status. these are zipped (both complete then grab
                //   functionally defined reponse from zip observable)
                // NOTE: wanted to use a Then operator but alas I don't think it is supported yet.
                let putOrgContacts = page.orgServices.putOrgContactsRequest(page.orgId, page.orgData, page.asTsaAdmin);
                let putOrgStatus = page.orgServices.updateOrganization(page.orgId, {status: page.orgData.organization.status}, page.asTsaAdmin);
                Observable.zip(putOrgContacts, putOrgStatus, 
                    (contactResponse: any, statusResponse:any) => ({contactResponse: contactResponse, statusResponse: statusResponse }))
                    .subscribe(
                        data => {

                            page.orgData = data.contactResponse;
                            page.orgData.organization.status = data.statusResponse.status;
                            page.orgData.members.sort(sortMembers);
                            page.canEdit = page.userIsGroupAdmin();
                            page.canEditOrg = false;
                            page.showSaveMessage = false;
                            page.presentToast("Group changes have been saved.");
                            page.navCtrl.pop();
                        },
                        err => {
                            console.log(err);
                            page.presentToast("An error occurred - the group changes could not be saved.");

                        });
            }
        }
    }

    openGroupActionModal(mode: string) {
        let org = this.orgData.organization;
        let page = this;
        let groupActionModal = page.modalControl.create(GroupAction, { org: org, mode: mode });
        groupActionModal.onDidDismiss(data => {
            if (data) {
                let action = data.action;
                let comment = data.comment;
                let groupId = data.id; // as opposed to request id which is needed for approve/decline
                if (action === "approve" || action === "decline") {
                    page.orgServices.getPendingOrgRequests().filter(x => x.organization.id == groupId).subscribe(
                        req => {
                            let toastText = "The group " + org.group + " has been " + (action === 'approve' ? "approved" : "declined") + " and the submitter has been notified.";
                            let actionSubmit = (action === 'approve' ? 2 : 3)
                            page.orgServices.administerOrganization(req.id, actionSubmit).subscribe({
                                next: results => {
                                    console.log(results);
                                    page.presentToast(toastText);
                                    page.navCtrl.pop();

                                },
                                error: err => {
                                    console.log(err);
                                    page.presentToast("Error - please contact TSA support");
                                }
                            });
                    });
                }
                else if(action === "inactive" || action === "active") {
                    let status = (action === "active" ? 0 : 1);
                    let toastText = "The group " + org.group + " has been set to " + action + ".";
                    page.orgServices.updateOrganization(org.id, {status: status}, page.asTsaAdmin).subscribe({
                        next: results => {
                            org.status = status;
                            page.loadOrgAndContacts(org.id);
                            console.log(results);
                            page.presentToast(toastText);
                        },
                        error: err => {
                            console.log("Error: " + err);
                            page.presentToast("Error - please contact TSA support");
                        }
                    });
                }
            }
        });
        groupActionModal.present();
    }
    presentToast(message: string) {
        let toast = this.toastController.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }  
}
