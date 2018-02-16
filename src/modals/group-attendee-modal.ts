import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ViewController, NavParams} from 'ionic-angular';
import {Member} from '../lib/model/member';
import {PhoneInputReactive} from '../lib/components/phone-input-reactive.component';

@Component({
    templateUrl: 'group-attendee-modal.html'
})
export class GroupAttendeeModal {
    attendee: Member;
    isNewAttendee: boolean = true;
    contactMethod: string;
    attendeeForm: FormGroup;
    

    //this may not be the best place for this as these validations can probably be reused
    // TODO: pull this out into a static_json-like container
    validation_messages = {
        'first_name': [
            {type: 'required', message: 'First Name is required.'},
            {type: 'minlength', message: 'First Name must be at least 1 character long.'},
            {type: 'maxlength', message: 'First Name cannot be more than 25 characters long.'},
            {type: 'pattern', message: 'First Name must contain only letters.'},
        ],
        'last_name': [
            {type: 'required', message: 'Last Name is required.'},
            {type: 'minlength', message: 'Last Name must be at least 2 characters long.'},
            {type: 'maxlength', message: 'Last Name cannot be more than 25 characters long.'},
            {type: 'pattern', message: 'Last Name must contain only letters.'},
        ]
    }




    constructor(public viewController: ViewController, public params: NavParams, private fb: FormBuilder) {
       this.attendee = (params.get('attendee')) ? params.get('attendee') : new Member(); // the caller should pass a Member no matter what but just in case...
    }
    
    
    
    
    dismiss() {
        this.viewController.dismiss();
    }
    
    prepareSaveAttendee(): Member {
        const formModel = this.attendeeForm.value;
        const saveAttendee: Member = {
            first_name: formModel.first_name as string,
            last_name: formModel.last_name as string,
            isAttending: formModel.isAttending as boolean,
            status: this.attendee.status || 0,
            role: this.attendee.role || 0,
            contactMethod: formModel.contactMethod as number,
            isContactSelected: this.attendee.isContactSelected,
            isPhoneSelected: this.attendee.isPhoneSelected,
            isEmailSelected: this.attendee.isEmailSelected,
            contactString: formModel.contactString as string,
            mobilenumber: 6302440857, //formModel.contactString as number,
            email: formModel.contactString as string,
            isAdmin: 0,
            isActive: 1,
            ext_id: this.attendee.ext_id   
        };
        return saveAttendee;
    }
    

    save() {
        this.attendee = this.prepareSaveAttendee();
        console.log('During Save:\n' + this.attendee.mobilenumber);

        this.viewController.dismiss(this.attendee);

    }

    ngOnInit(): void {
        this.attendeeForm = this.fb.group(
            {
                last_name: ['', Validators.required],
                first_name: ['', Validators.required],
                contactString: '',
                contactMethod: ['', Validators.required],
                isAttending: ['true', Validators.required],
                email: ['', Validators.email]
            }
        );
        if (this.attendee.last_name) {  //for now, an existing attendee will have this field filled in; probably a cleaner way to do this
            this.attendeeForm.setValue({
                first_name: this.attendee.first_name,
                last_name: this.attendee.last_name,
                //status: this.attendee.status,
                //role: this.attendee.role,
                //isContactSelected: this.attendee.isContactSelected,
                //isPhoneSelected: this.attendee.isPhoneSelected,
                //isEmailSelected: this.attendee.isEmailSelected,
                contactString: this.attendee.contactString,
                //mobilenumber: this.attendee.mobilenumber,
                //email: this.attendee.email,
                //isAdmin: this.attendee.isAdmin,
                //isActive: this.attendee.isActive,
                //ext_id: this.attendee.ext_id,
                contactMethod: this.attendee.contactMethod,
                isAttending: this.attendee.isAttending
                
            });
        }
    }
}