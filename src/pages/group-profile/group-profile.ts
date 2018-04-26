import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';

import { Organization } from '../../lib/model/organization';
import { AlertController } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { OrganizationServices } from '../../lib/service/organization';
import { MemberPopOver } from './member-popover';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-group-profile',
    templateUrl: 'group-profile.html',
    providers: [OrganizationServices, MemberPopOver],


})
export class GroupProfilePage {
    public orgId: number = null;
    public orgData: any = null;
    public newMember: any = null;
    public invitedHere: any = [];


    public canEdit: boolean = null;
    public arrayOrgTypes: any = [];
    public canEditOrg: boolean = false;
    public orgChg: boolean = false;
    public memberChg: boolean = false;
    public cancelled: boolean = false;
    public desktop: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public orgServices: OrganizationServices, public userServices: UserServices, public alertCtrl: AlertController,
        public modalControl: ModalController,
        public m: MemberPopOver
    ) { }


    ionViewDidLoad() {

        console.log('ionViewDidLoad GroupProfilePage ' + this.navParams.get('orgid'));
        this.orgId = this.navParams.get('orgid');
        this.loadOrgContacts(this.orgId);
        var page = this;
        this.orgServices.getOrgTypes().subscribe(orgData => {
            page.arrayOrgTypes = orgData;
        },
            err => {
                console.log("Unable to load organization Types in groupProfile page");
            });
    }

    ionViewDidEnter() {
        this.cancelled = false;
    }
    public addNew() {

        if (!this.canEdit)
            return;
        var newTemplate = {
            first_name: '',
            last_name: '',
            active: false,

            email: '',
            contact_method: 'Email',
            mobilenumber: ''
        };

        let userPop = this.modalControl.create(MemberPopOver, { cssClass: "member-modal", action: 'new', record: newTemplate }, { cssClass: 'member-modal', enableBackdropDismiss: false });
        userPop.present();
        userPop.onDidDismiss(data => {
            if (data && data.contact_method) {

                //console.log(data);
                data.showDelete = false;
                data.changed = true;
                data.new = true;
                data.isAdmin = false;
                data.role = 0;
                data.isEmailSelected = false;
                data.isPhoneSelected = false;
                if (data.contact_method == 'Email') { data.isEmailSelected = true; }
                if (data.contact_method == 'Phone') { data.isPhoneSelected = true; }
                this.orgData.members.unshift(data);
                this.memberChg = true;
            }


        });



    }

    public updateExisting(member) {

        if (!this.canEdit)
            return;


        let userPop = this.modalControl.create(MemberPopOver, { cssClass: "member-modal", action: 'update', record: member }, { cssClass: 'member-modal', enableBackdropDismiss: false });
        userPop.present();
        userPop.onDidDismiss(data => {
            if (data && data.contact_method) {

                //console.log(data);
                data.showDelete = false;
                data.changed = true;


                if (data.contact_method == 'Email') { data.isEmailSelected = true; }
                if (data.contact_method == 'Phone') { data.isPhoneSelected = true; }
                member.first_name = data.first_name;
                member.last_name = data.last_name;
                member.chaged = true;
                member.contact_method = data.contact_method;
                member.email = data.email;
                member.status = data.status;
                member.mobilenumber = data.mobilenumber;


                this.memberChg = true;
            }


        });



    }



    public groupApproved() {
        if (this.orgData && this.orgData.organization) {
            return (this.orgData.organization.status == 0)

        }
        else {
            return (false);
        }
    }

    public decodeOrgType(orgType) {
        if (orgType == null)
            return ("Not Present");

        let i: number = 0;
        for (i = 0; i < this.arrayOrgTypes.length; i++) {
            if (this.arrayOrgTypes[i].id == orgType) {
                return this.arrayOrgTypes[i].name;
            }
        }
        return ("");
    }
    public decodeProfileStatus(status) {
        if (status == null) {
            return "Status Unknown";
        }
        var codes = ["Status Unknown", "Active Member", "Inactive Member", "Temporary Member"];
        return (codes[status] ? codes[status] : '');
    }
    presentConfirm() {
        var page = this;
        let alert = this.alertCtrl.create({
            title: 'Save Changes',
            message: 'You made changes to organization. Would you like to save those?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                        //page.navCtrl.pop();
                    }
                },
                {
                    text: 'Save',
                    handler: () => {
                        page.saveOrg()
                        alert.dismiss();
                        // console.log('Saved');
                    }
                }
            ]

        });
        alert.present();
    }
    ionViewWillLeave() {

        if (this.cancelled) {

            return;
        }
        if (this.memberChg || this.orgChg) {

            this.presentConfirm();
        }
    }




    public updateAdminStatus(event, member) {
        this.memberChg = true;
        if (!member.isAdmin) {
            if (this.adminCount() >= 2) {
                setTimeout(function () {
                    member.isAdmin = false;
                }, 100);

            }
        }
        else {
            if (this.adminCount() <= 1) {
                setTimeout(function () {
                    member.isAdmin = true;
                }, 100
                );


            }

        }


    }
    public decodeRole(role) {
        var roleEn = ['Member', 'Admin'];
        return (roleEn[role]);
    }
    public validRoles() {
        return ([0, 1, 2]);
    }

    public confirmAdmDelete(admrecord) {
        let page = this;
        let alert = this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: 'Do you want to delete this member?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        //    console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        page.deleteAdminRec(admrecord);
                    }
                }
            ]
        });
        alert.present();
    }

    public confirmMemberDelete(record) {
        let page = this;
        let alert = this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: 'Do you want to delete this member?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        page.deleteMemberRec(record);
                    }
                }
            ]
        });
        alert.present();
    }
    public admins() {
        var result = [];
        if (this.orgData) {

            this.orgData.members.forEach(function (member) {


                if ((member.isAdmin))
                    result.push(member);
            });
        }
        return (result);
    }

    public adminCount() {

        //console.log (this.admins().length);
        return this.admins().length;
    }

    public deleteAdminRec(admrecord: any) {
        if (this.adminCount() > 0) {
            this.orgData.members = this.orgData.members.filter(obj => obj !== admrecord);
            this.memberChg = true;
        }
    }
    public deleteMemberRec(member) {
        this.orgData.members = this.orgData.members.filter(obj => obj !== member);
        this.memberChg = true;
    }

    public canEditCheck() {
        var prof = this.userServices.user.profile;
        var contact_method = prof.contactmethod_name;
        var email = prof.email;
        var mobile = prof.mobilenumber;
        var userid = prof.user;

        if (this.admins()) {
            var i;
            var admins = this.admins();
            for (i = 0; i < admins.length; i++) {
                if (contact_method == 'Email') {
                    if (admins[i].email == email) {
                        return true;
                    }
                }
                if (contact_method == 'Phone') {
                    if (admins[i].email == email) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    showDelete(member) {
        if (this.canEdit) {
            if (!member.showDelete) {
                member.showDelete = true;
            }
            else {
                member.showDelete = false;
            }
        }
    }


    groupAdmin(role) {
        return (role == 1);
    }

    sortMemberData(members, organization) {
        var admins = [];
        var invited = [];
        var rest = [];
        var page = this;
        organization.upper_name_editablae = false;
        organization.upper_name_error = null;
        organization.group_editablae = false;
        organization.gropu_error = null;
        if (organization.org_type == null) {
            organization.org_type = { id: null };
        }

        members.forEach(function (member) {
            member.showDelete = false;
            member.changed = false;
            member.new = false;
            member.isAdmin = false;
            if ((member.role == 1) || (member.role == 2))
                member.isAdmin = true;


            if (typeof member.isEmailSelected != 'undefined') {
                if (member.isEmailSelected) {
                    member.contact_method = 'Email';
                }
            }
            if (typeof member.isPhoneSelected != 'undefined') {
                if (member.isPhoneSelected) {
                    member.contact_method = 'Phone';
                }
            }
            if (!member.contact_method) {
                if (member.email) {
                    member.contact_method = 'Email';
                }
                if (member.mobilenumber) {
                    member.contact_method = 'Phone';
                }

            }

        });

    };

    checkOrgnName() {

        this.orgData.organization.upper_name.error = null;
        if (this.orgData.organization.upper_name.length < 3) {
            this.orgData.organization.upper_name.error = "Name should be 3 character or more";
        }

    }

    loadOrgContacts(orgId) {

        let page = this;
        let useAdmin = this.userServices.user.profile.accounttype == 'A';

            this.orgServices.getOrganizationContacts(orgId, useAdmin).subscribe(orgData => {
                page.orgData = orgData;
                //console.log("OrgData " + page.orgData.organization.upper_name );
                page.sortMemberData(this.orgData.members, orgData.organization);
                page.canEdit = page.canEditCheck();
                page.canEditOrg = false;
            },
                err => {
                    this.orgServices.getMyPendingOrganizationsDetails(orgId).subscribe(
                        orgData => {
                            page.orgData = orgData;
                            // organization status is = 0 ->appoved. Should be 1 
                            page.orgData.organization.status = 1;
                            //console.log("OrgData " + page.orgData.organization.upper_name );
                            page.sortMemberData(this.orgData.members, orgData.organization);
                            page.canEdit = page.canEditCheck();

                            if (page.canEdit) page.canEditOrg = true;

                        },
                        err2 => {
                            console.log(err2);
                            this.orgData = null;
                        }
                    );
                    console.log(err);
                });
        
    }

    public validatePost(data) {

        // One or two admins

        if ((this.adminCount() > 0) && (this.adminCount() < 3))
            return true;

        return false;
    }

    public cancelThisPage() {
        // prevent Save popup
        this.cancelled = true;
        this.navCtrl.push(HomePage);

    }
    public mapData(org) {
        let myorg: any = {};
        var page = this;
        if (org.organization.status != 0) {
            myorg.id = org.id;
            myorg.owner_id = org.owner_id;
            myorg.approver_id = org.approver_id;
            myorg.status = org.status;
            myorg.organization = {};
            // myorg.organization.id=org.organization.id;
            myorg.organization.name = org.organization.name;
            myorg.organization.group = org.organization.group;
            myorg.organization.description = org.organization.description;
            myorg.organization.status = org.organization.description;
            myorg.organization.org_type = org.organization.org_type;
            myorg.organization.website = org.organization.website;
            myorg.members = [];
            org.members.forEach(function (m) {
                let mem: any = {};
                mem.status = m.status;
                // console.log('changing status to ',page.decodeProfileStatus(m.status));
                mem.mobilenumber = m.mobilenumber;
                mem.first_name = m.first_name;
                mem.last_name = m.last_name;
                mem.isEmailSelected = m.isEmailSelected;
                mem.isPhoneSelected = m.isPhoneSelected;
                mem.email = m.email;
                mem.mobilenumber = m.mobilenumber;
                mem.role = m.role;
                if (m.ext_id) {
                    mem.ext_id = m.ext_id;
                }

                myorg.members.push(mem);

            });
            return (myorg);
        } else // if (org.organization.status==0)
        {
            myorg.members = [];
            org.members.forEach(function (m) {
                let mem: any = {};
                mem.status = m.status;
                //console.log('changing status to ',m.status, page.decodeProfileStatus(m.status));
                mem.mobilenumber = m.mobilenumber;
                mem.first_name = m.first_name;
                mem.last_name = m.last_name;
                mem.contact_method = m.contact_method;
                mem.email = m.email;
                mem.mobilenumber = m.mobilenumber;
                mem.role = m.role;
                if (m.ext_id) {
                    mem.ext_id = m.ext_id;
                }

                myorg.members.push(mem);

            });
            return (myorg);


        }

    }


    public loggedInUser(member)
    /* return true if member is logged in user  */ {
        var prof = this.userServices.user.profile;
        var contact_method = prof.contactmethod_name;
        var email = prof.email;
        var mobile = prof.mobilenumber;


        if ((member.contactmethod_name == 'Email') && (email == member.email)) {
            return true;
        }
        else {
            if (mobile && (mobile == member.mobilenumber)) {
                return true;
            }
        }
        return false

    }

    public saveOrg() {

        if (!this.orgData)
            return;
        if (!this.validatePost(this.orgData))
            return;
        var page = this;
        var postOrg = this.mapData(this.orgData);
        if (!this.groupApproved()) {

            this.orgServices.putOrganizationRequest(this.orgId, postOrg)
                .subscribe(
                    data => {

                        // console.log("Post Success");
                        page.orgData = JSON.parse(data._body);
                        // organization status is = 0 ->appoved. Should be 1 

                        page.orgData.organization.status = 1;
                        // console.log("OrgData " + page.orgData.organization.upper_name );
                        page.sortMemberData(this.orgData.members, this.orgData.organization);
                        page.canEdit = page.canEditCheck();

                        if (page.canEdit) {
                            page.canEditOrg = true;
                        }
                        else {
                            page.canEditOrg = false;
                        }
                        page.orgChg = false;
                        page.memberChg = false;
                        page.navCtrl.push(HomePage);
                    },
                    err => {
                        // err = JSON.parse(err);
                        console.log(err);
                    });
        }


        if (this.groupApproved()) {

            this.orgServices.putOrgContactsRequest(this.orgId, postOrg)
                .subscribe(
                    data => {

                        //  console.log("Post Success");
                        page.orgData = JSON.parse(data._body);
                        // organization status is = 0 ->appoved. Should be 1 
                        page.orgData.organization.status = 0;
                        // console.log("OrgData " + page.orgData.organization.upper_name );
                        page.sortMemberData(this.orgData.members, this.orgData.organization);
                        page.canEdit = page.canEditCheck();

                        page.canEditOrg = false;

                        page.orgChg = false;
                        page.memberChg = false;
                        page.navCtrl.push(HomePage);
                    },
                    err => {
                        // err = JSON.parse(err);
                        console.log(err);
                    });
        }

    }

}
