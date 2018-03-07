import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { EditGroupAttendancePage } from '../edit-group-attendance/edit-group-attendance';
import { GroupAttendeeModal } from '../../modals/group-attendee-modal';
import { Member } from '../../lib/model/member';
import { Contact } from '../../lib/model/contact';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { mobileXorEmailValidator } from '../../lib/validators/mobilexoremailvalidator';
import { MemberDataEntry } from '../../lib/components/member-data-entry/member-data-entry';
import { UserServices } from '../../lib/service/user';
import { UserProfile } from '../../lib/model/user-profile';

@Component({
    templateUrl: 'testing.html'
})
export class TestingPage implements AfterViewInit{
    public member : UserProfile;
    serverVersionNumber: string = "1.700";
    versionNumber: string = "";
    buildNumber: string = "";
    versionString: string = "";
    serverEnv: string = "test";
    testFormGroup: FormGroup;
    public formArray: FormArray = new FormArray([]);
    public contact: Contact = new Contact();

    @ViewChildren(MemberDataEntry) membersDataEntry: QueryList<MemberDataEntry>;


    constructor(public modalControl: ModalController, public fb: FormBuilder,
                public userServices: UserServices) {
        this.member = userServices.user;
        this.contact.first_name = "Peter";
        this.contact.last_name = "Smith";
        this.contact.ext_id = "435";
        this.contact.contactString = "barndancer@square.com";
        //this.formArray = this.fb.array([]);
        for (let i = 0; i < 2; i++) {
            this.formArray.push(this.fb.group( // set up the validation
                {
                    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
                    contactString: '',
                    firstName: ['', [Validators.required, Validators.maxLength(25)]],
                    contactMethod: '', // covered by mobileXorEmailValidator below
                    isActive: ['1', Validators.required], //this is defaulted to 'Yes', and there is no way to 'unselect' (must be yes or no)
                    isAdmin: ['0', Validators.required] //this is defaulted to 'Yes', and there is no way to 'unselect' (must be yes or no)
                },
                {
                    validator: mobileXorEmailValidator()
                }
            ));
        }

    }
    public openEditGroupAttendance() {
        console.log("openEditGroupAttendance");
        let attendee = new Member();
        attendee.first_name = "Peter";
        attendee.last_name = "Smith";
        attendee.isAttending = false;
        attendee.ext_id = "435";
        attendee.contactString = "barndancer@square.com";
        let myModal = this.modalControl.create(EditGroupAttendancePage);
        myModal.onDidDismiss(data => {
            console.log(data);
        });
        myModal.present();
    }

    public openBasicModal() {
        console.log("openBasicModal");
        let attendee = new Member();
        attendee.first_name = "Peter";
        attendee.last_name = "Smith";
        attendee.isAttending = false;
        attendee.ext_id = "435";
        attendee.contactString = "barndancer@square.com";
        let myModal = this.modalControl.create(GroupAttendeeModal, { attendee: attendee });
        myModal.onDidDismiss(data => {
            console.log(data);
        });
        myModal.present();
    }
    /**
     *   contact class instead of member because member has unneeded fields AND
     *     the Member is the app's terminology
     */
    setMembers(contacts: Contact[]) {

    }
    ngAfterViewInit(): void {
        let mde: MemberDataEntry[] = this.membersDataEntry.toArray();
        //console.log(mde[0].testMember);
    }
}
