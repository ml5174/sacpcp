
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PopoverController, AlertController, Navbar } from 'ionic-angular';
import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { UserServices } from '../../lib/service/user';
import { OrganizationServices } from '../../lib/service/organization';
import { HomePage } from '../home/home';
import { MyGroupsPage } from '../mygroups/mygroups';
import { Organization } from '../../lib/model/organization'
import { Contact } from '../../lib/model/contact'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from '../../lib/model/member';
import { UserProfile } from '../../lib/model/user-profile';
import { MemberDataEntry } from '../../lib/components/member-data-entry/member-data-entry';

@Component({
    selector: 'page-create-group',
    templateUrl: 'create-group.html'
})
export class CreateGroupPage implements OnInit {

    @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
    @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChildren(MemberDataEntry) membersDataEntry: QueryList<MemberDataEntry>;

    public groupMembers: UserProfile[]; 
    //public rowNum: number;
    public isContactSelected: boolean
    public orgRequest: Organization
    public leave: boolean = false;
    public createGroupForm: FormGroup;
    submitAttempt: boolean = false;
    public orgs: Array<string> = [];
    public organizationTypes: Array<any> = [];
    public filteredList: Array<string> = [];
    public showList: boolean
    public isNotBackButton: boolean
    public isGroupFinished: boolean = false;

    constructor(public navCtrl: NavController,
        public toastCtrl: ToastController,
        public navParams: NavParams,
        public userServices: UserServices,
        public formBuilder: FormBuilder,
        public orgServices: OrganizationServices,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController) {

    }
    /**
     *   initMembers():
     *   When first loaded, the Create Group page will load as (potential) group members:
     *     the current user (add a required flag) and a blank 'member'.  The display up to down order
     *     is 1) blank member, 2) logged in user as admin
     */
    private initMembers(): void {
        // add a blank member component
        this.groupMembers = Array<UserProfile>(new UserProfile());
        // then add the default - the logged in user w/admin role
        let requiredUser = this.userServices.user;
        requiredUser.required = true;
        requiredUser.profile.isAdmin = true;
        requiredUser.profile.role = 2; //admin - 2; member - 0; not sure what 1 is
        this.groupMembers.push(requiredUser);
    }

    onMemberDeleted(member: UserProfile) {
        console.log("Is member required? " + member.required);
        let index = this.groupMembers.findIndex((element) => (element === member));
        console.log("Searching for index: " + index);
        if (index != -1) {
            this.groupMembers.splice(index, 1);
            this.createGroupForm.updateValueAndValidity({onlySelf: false, emitEvent: true});
            
        }
    }
    /**
     *  This function can only be called if it is 'legal' to add a member (button is disabled
     *   otherwise)
     * 
     * 
     * 
     */
    public addMember(): void {
            this.groupMembers.unshift(new UserProfile());
    }

    public cancel(ev) {
        this.isNotBackButton = true;
        this.presentConfirm();
    }


    /**
     *  in order to add another member to this (to be created) group:
     *   1) all members already on the page MUST be filled out and valid
     * 
     *   TODO: figure out if switching the data entry for a
     *     valid member to read only upon clicking
     *     'Add A Member' is useful
     */
    public canAddMember(): boolean {
        if (this.membersDataEntry) {
            let noInvalidMembers = true;
            for (let mde of this.membersDataEntry.toArray()) {
                noInvalidMembers = noInvalidMembers && mde.formGroup.valid;
            }
            return noInvalidMembers;
        }
        else {
            return false;
        }        
    }

    public canSubmit(): boolean {
        if (this.membersDataEntry) {
            let validGroup = this.createGroupForm.valid;
            let atLeastOneValidMember = false;
            let adminCount = 0
            let noInvalidMembers = true;
            for (let mde of this.membersDataEntry.toArray()) {
                atLeastOneValidMember = atLeastOneValidMember || mde.formGroup.valid;
                noInvalidMembers = noInvalidMembers && (mde.formGroup.pristine || mde.formGroup.valid);
                
            }
            return validGroup && atLeastOneValidMember && noInvalidMembers;
        }
        else {
            return false;
        }
    }

    private meetsAdminRequirement(): boolean {
        let adminCount = 0;
        for (let mde of this.membersDataEntry.toArray()) {
            if(mde.formGroup.valid && mde.formGroup.controls.role.value == 2) {
                adminCount++;
            }
        } 
        return (adminCount > 0) && (adminCount < 3);
    }

    public createGroupSubmission() {
       
        //Field has been taken care of (Submit is disabled otherwise)
        // However, need to make sure that at least one of the group members is an admin
        if(!this.meetsAdminRequirement()) {
            let alert = this.alertCtrl.create({
                title: 'One or Two Group Admin(s) Required',
                message: '<center>One or two member(s) must be assigned the Admin role. Also,<br />Also, no more than two can be assigned.</center>',
                buttons: [
                    {
                        text: 'Close',
                        handler: () => {}
                    }
                ]
            });
            alert.present();
            return false;
        }
        //set group (model) w/group (form)
        let group: Organization = {
            group: this.createGroupForm.controls.group.value,
            name: this.createGroupForm.controls.name.value,
            org_type: {id: this.createGroupForm.controls.org_type.value},
            organization_id: null,
            status: 0
        }

        // Create member data with member form elements
        // Only use members that have lastName filled and are valid
        //  
        let members: Array<any> = Array<any>();
        for (let mde of this.membersDataEntry.toArray()) {
          //  console.log("fg: " + JSON.stringify(mde.formGroup.errors) +
              //  "; valid: " + mde.formGroup.valid);

            if (mde.formGroup.valid && mde.formGroup.controls['firstName'].value &&
                mde.formGroup.controls['firstName'].value.length > 0) {
                let control = mde.formGroup.controls;
                let email = (control['contactMethod'].value == 2) ?
                    control['contactString'].value : null;
                let mobilenumber = (control['contactMethod'].value == 1) ?
                    control['contactString'].value : null;
                members.push({
                    first_name: control['firstName'].value,
                    last_name: control['lastName'].value,
                    email: email,
                    mobilenumber: mobilenumber,
                    role: control['role'].value,
                    active: control['isActive'].value
                });
            }
        }
        this.orgServices.createGroup(group, members).subscribe(
            results => {
                this.presentFinishedGroup();
            },
            err => {
                err = JSON.parse(err);
                console.log(err);
                let alert = this.alertCtrl.create({
                    title: 'Invalid Group Request',
                    message: '<center>' + err[Object.keys(err)[0]] + '</center>',
                    buttons: [
                        {
                            text: 'Close',
                            handler: () => {

                            }
                        }
                    ]
                });
                alert.present();
            },
            () => {
                console.log("createGroup complete.");
            }
        );

    }

    presentRedoForm() {
        // org name 2 chars + required
        // group name 2 chars + required
        // member complete email/phone
        // 
        let alert = this.alertCtrl.create({
            title: 'Invalid Organization Request',
            message: 'The request is invalid. Please make sure the following requirements are met:'
                + '<ul><li>Organization Name is filled out and at least two characters long</li>'
                + '<li>Group Name is filled out and at least two characters long</li>'
                + "<li> Each Member's name is filled out</li>"
                + '<li> A phone number or email is present for each member</li>'
                + '<li> Phone Numbers must be 11 digits, starting with the number 1 (Country Code) </li></ul>',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {

                    }
                }
            ],
            cssClass: 'wide'
        });
        alert.present();
    }

    initializeItems() {
        if (this.orgs.length === 0) {
            var page = this
            this.orgServices.getAllOrgNames().subscribe(
                orgs => {
                    for (let org of <Organization[]>orgs) {
                        page.orgs.push(org.name);
                    }
                },
                err => {
                    console.log("initializeItems() error: " + err);
                },
                () => {
                }
            );
        }
    }

    resetToOriginalState() {
        this.filteredList = this.orgs;
    }
    getItems(ev: any) {
        // Reset items back to all of the items
        this.resetToOriginalState();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            // Filter the items
            this.filteredList = this.filteredList.filter((item) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });

            // Show the results
            this.showList = true;
        } else {

            // hide the results when the query is empty
            this.showList = false;
        }
    }

    presentConfirm(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: 'Leave This Page',
                message: 'Do you want to continue without creating this group?',
                buttons: [
                    {
                        text: 'No, Stay Here',
                        role: 'cancel',
                        handler: () => {

                            alert.dismiss().then(() => { resolve(false); });
                            this.isNotBackButton = false;
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            if (this.isNotBackButton) {
                                this.navCtrl.push(HomePage);
                            }
                            else {
                                alert.dismiss().then(() => { resolve(true); });
                            }

                        }
                    }
                ]
            });
            var page = this;

            alert.present();
        });
    }

    presentFinishedGroup() {
        this.isGroupFinished = true;
        let alert = this.alertCtrl.create({
            title: ' Create Group Result',
            message: '<div style="text-align: center">Your request has been submitted to the Salvation Army. ' +
                'You will be notified when it is approved.</div>',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        alert.present();
    }
    // trackByIndex(index: number, value: number) {
    //     return index;
    // }
    orgNameSelected(org: string) {
        this.createGroupForm.controls.name.setValue(org);
        this.showList = false;
    }

    ionViewCanLeave() {
        if (!this.isNotBackButton && !this.isGroupFinished) {
            return this.presentConfirm();
        }
        this.isNotBackButton = true;
    }
    /**
     * after loading, automatically add the logged in user's data for the first group member
     */

    ngOnInit(): void {
        this.initMembers();
        this.createGroupForm = this.formBuilder.group({
            description: ['', Validators.maxLength(64)],
            name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
            group: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
            org_type: ['', Validators.required],
            members: this.formBuilder.array([])

        });
        this.orgServices.getAllOrganizationTypes().subscribe(orgTypes => {
            for (let orgType of orgTypes) {
                console.log("orgtype name: " + orgType.name);
                this.organizationTypes.push(orgType);
            }
        });
    }
    
    

}
