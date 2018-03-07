
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {PopoverController, AlertController, Navbar} from 'ionic-angular';
import {Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {UserServices} from '../../lib/service/user';
import {OrganizationServices} from '../../lib/service/organization';
import {HomePage} from '../home/home';
import {MyGroupsPage} from '../mygroups/mygroups';
import {Organization} from '../../lib/model/organization'
import {Contact} from '../../lib/model/contact'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Member} from '../../lib/model/member';
import { UserProfile } from '../../lib/model/user-profile';
import { MemberDataEntry } from '../../lib/components/member-data-entry/member-data-entry';

@Component({
    selector: 'page-create-group',
    templateUrl: 'create-group.html',
    providers: [OrganizationServices]
})
export class CreateGroupPage implements OnInit, AfterViewInit{

    @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
    @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChildren(MemberDataEntry) membersDataEntry: QueryList<MemberDataEntry>;

    public groupMembers : UserProfile[] = Array<UserProfile>();
    public rowNum: number;
    public isContactSelected: boolean
    public orgRequest: Organization
    public rows: Array<Contact> = []
    public leave: boolean = false;
    createGroupForm: FormGroup;
    submitAttempt: boolean = false;
    public orgs: Array<string> = [];
    public organizationTypes: Array<string> = [];
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

        this.orgRequest = new Organization();
        this.orgRequest.name = '';
        this.orgRequest.description = '';
        this.orgRequest.group = '';
        this.createGroupForm = formBuilder.group({
            first_name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])]
        });
        
    }
    /**
     *   When first loaded, the Create Group page will load as (potential) group members:
     *     the current user (add a required flag) and a blank 'member'
     */
    private initMembers(): void {
        this.groupMembers.push(new UserProfile());

        let requiredUser = this.userServices.user;
        requiredUser.required = true;
        this.groupMembers.push(requiredUser);
    }

    public addMember(): void {

        if (this.rows[0].first_name === ''
            || this.rows[0].last_name === ''
            || this.rows[0].contactString === '') {
            let alert = this.alertCtrl.create({
                title: 'Incomplete Member Information',
                message: 'Please finish filling out the current row before adding another.',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {

                        }
                    }
                ]
            });
            alert.present();
        }

        else if (this.rows.length > 0) {
            this.rows.unshift({
                first_name: '', last_name: '', isAdmin: 0, isActive: 0, status: 1, role: 0,
                contactString: '', isContactSelected: false, isPhoneSelected: false,
                isEmailSelected: false, mobilenumber: null, email: ''
            });
        }
        else {
            this.rows.push({
                first_name: '', last_name: '', isAdmin: 0, isActive: 0, status: 1, role: 0,
                contactString: '', isContactSelected: false, isPhoneSelected: false,
                isEmailSelected: false, mobilenumber: null, email: ''
            });
        }

    }
    public cancel(ev) {
        this.isNotBackButton = true;
        this.presentConfirm();
    }
    flipBoolean(contact, index) {
        if (contact !== '' && contact !== null && contact !== undefined) {

            if (contact === "Phone") {
                this.rows[index].isPhoneSelected = true;
                this.rows[index].isEmailSelected = false;
            }
            if (contact === "Email") {
                this.rows[index].isEmailSelected = true;
                this.rows[index].isPhoneSelected = false;
            }

        }

    }
    addGroup() {

        var members = this.rows;

        members.forEach(element => {
            if (element.isEmailSelected) {
                element.mobilenumber = null;
            }
            if (element.isPhoneSelected) {
                element.email = "";
            }
            delete element.isActive;
            delete element.isAdmin;
            delete element.isContactSelected;
            delete element.contactString
        });
        var org = this.orgRequest;
        if (this.isOrgValid(org) && this.areMembersValid(members)) {

            this.isGroupFinished = true;
            var organization = {organization};
            organization.organization = org;
            organization.members = members;
            var jsons = JSON.stringify(organization);
            var page = this;
            var user = this.userServices.user;
            var response;
            this.orgServices.createOrganization(jsons).subscribe(
                data => {
                    this.presentFinishedGroup();
                },
                err => {
                    err = JSON.parse(err);
                    console.log(err);
                    let alert = this.alertCtrl.create({
                        title: 'Invalid Organization Request',
                        message: '<center>' + err[Object.keys(err)[0]] + '</center>',
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {

                                }
                            }
                        ]
                    });
                    alert.present();
                }
            )
        }
        else {
            this.presentRedoForm();
        }



    }
    setAsNumber(num) {
        num = parseInt(num);
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
    isOrgValid(org) {
        return org.name
            && org.group
            && org.description
            && org.name.length >= 2
            && org.group.length >= 2
            && org.name != org.group

    }

    initializeItems() {
        if (this.orgs.length === 0) {
            var page = this
            this.orgServices.getAllOrgNames().subscribe(
                orgs => {
                    for (let org of <Organization[]> orgs) {
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
    deleteMember(x) {
        if (this.rows.length >= 2) {
            this.rows.splice(x, 1);
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Number of Members',
                message: '<center>Your Group Must Have at Least One Member</center>',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {

                        }
                    }
                ]
            });
            alert.present();


        }
    }
    areMembersValid(members) {
        var isValid = true;
        members.forEach(m => {
            if (!m.email
                && !m.mobilenumber
                || !m.first_name
                || !m.last_name
                || !m.email
                && m.mobilenumber.length != 11
                || !m.mobilenumber
                && !this.validateEmail(m.email)) {
                isValid = false;
            }

        });
        return isValid;
    }
    validateEmail(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var bool = re.test(email);
        return bool;
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

                            alert.dismiss().then(() => {resolve(false);});
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
                                alert.dismiss().then(() => {resolve(true);});
                            }

                        }
                    }
                ]
            });
            var page = this

            alert.present()
        });
    }

    presentFinishedGroup() {
        let alert = this.alertCtrl.create({
            title: 'Confirm Finished Group',
            message: 'Your request has been submitted to the Salvation Army. You will be notified when it is approved.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.push(MyGroupsPage);
                    }
                }
            ]
        });
        alert.present();
    }
    trackByIndex(index: number, value: number) {
        return index;
    }
    orgNameSelected(org: string) {
        this.createGroupForm.controls.organizationName.setValue(org);
        this.showList = false;
    }

    submit() {
        this.presentFinishedGroup()
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
    ionViewDidLoad() {
        var orgRequest = this.orgRequest;
        var user = this.userServices.user;
        this.rows.push({
            first_name: user.profile.first_name, status: 1, role: 2,
            last_name: user.profile.last_name, isAdmin: 2, contactString: user.profile.contactmethod_name,
            isActive: user.profile.active, mobilenumber: user.profile.mobilenumber, email: user.profile.email,
            isContactSelected: false, isEmailSelected: user.profile.contactmethod_name === "Email",
            isPhoneSelected: user.profile.contactmethod_name === "Phone", ext_id: user.profile.ext_id
        })
        this.addMember();
        console.log('ionViewDidLoad CreateGroupPage');
    }

    ngOnInit(): void {
        this.initMembers();
        this.createGroupForm = this.formBuilder.group({
            groupDescription: [''],
            organizationName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
            groupName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
            organizationTypeControl:['', Validators.required],
            members: this.formBuilder.array([])

        });
        this.orgServices.getOrganizationTypes().subscribe(orgTypes =>{
            for (let orgType of orgTypes) {
                console.log("orgtype name: " + orgType.name);
                this.organizationTypes.push(orgType.name);
            }
        });
        this.orgServices.getAllGroups().subscribe(groups =>{
            for (let group of groups) {
                console.log("org name: " + group.upper_name + "; group name: " + 
                group.upper_group);
                this.orgServices.isGroupUnique(group.upper_name, group.upper_group));
                //this.organizationTypes.push(orgType.name);
            }
        });    
    }
    ngAfterViewInit(): void {
        let mde: MemberDataEntry[] = this.membersDataEntry.toArray();
    }

}
