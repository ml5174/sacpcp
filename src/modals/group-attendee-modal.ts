import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {mobileXorEmailValidator} from '../lib/validators/mobilexoremailvalidator';
import {FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {ViewController, NavParams} from 'ionic-angular';
import {Member} from '../lib/model/member';
import { PhoneInput } from '../lib/components/phone-input.component';

@Component({
    templateUrl: 'group-attendee-modal.html',
    selector: 'group-attendee-modal'
})
export class GroupAttendeeModal {
    attendee: Member;
    attendeeForm: FormGroup;
    isAddition: boolean = false; 
    @ViewChild('preferredNumber') preferredNumber : PhoneInput;
    @Output() mobileValueChanged = new EventEmitter();

    //this may not be the best place for this as these validations can probably be reused

    constructor(public viewController: ViewController, public params: NavParams, private fb: FormBuilder) {
       this.attendee = (params.get('attendee')) ? params.get('attendee') : new Member(); // the caller should pass a Member no matter what but just in case...
    }
    
    dismiss() {
        this.viewController.dismiss();
    }
    delete() {  // TODO: may need a confirm dialog but this should be easy enough to recover from
        this.attendee.isActive = 0; // this field is a number but has a boolean-type name
        this.viewController.dismiss();
    }
    
    prepareSaveAttendee(): Member {
        const formModel = this.attendeeForm.value;
        const saveAttendee: Member = {
            first_name: formModel.first_name as string,
            last_name: formModel.last_name as string,
            isAttending: formModel.isAttending as boolean,
            isTypeAttendee: this.attendee.isTypeAttendee,
            status: this.attendee.status || 0,
            role: this.attendee.role || 0,
            contactMethod: formModel.contactMethod as number,
            isContactSelected: formModel.contactMethod == 1 || formModel.contactMethod == 2,
            isPhoneSelected: formModel.contactMethod == 1,
            isEmailSelected: formModel.contactMethod == 2,
            contactString: formModel.contactString as string,
            mobilenumber: formModel.contactMethod == 1 ? this.preferredNumber.getPN_lim() : null,
            email: formModel.contactMethod == 2 ? formModel.contactString : null,
            isAdmin: 0,
            isActive: 1,
            ext_id: this.attendee.ext_id   
        };
        if (formModel.contactMethod == 1) {
            saveAttendee.contactString = this.preferredNumber.getPN_lim();
        }
        else {
            saveAttendee.contactString = formModel.contactString;
        }
        return saveAttendee;
    }
    
    save() {
        this.attendee = this.prepareSaveAttendee();
        //console.log('During Save:\n' + this.attendee.mobilenumber);

        this.viewController.dismiss(this.attendee);
    }
    
    ngOnInit(): void {
        console.log('ngOnInit');
        this.attendeeForm = this.fb.group( // set up the validation
            {
                last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
                first_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
                contactString: '', // covered by mobileXorEmailValidator below
                isAttending: ['true', Validators.required], //this is defaulted to 'Yes', and there is no way to 'unselect' (must be yes or no)
                contactMethod: '' // covered by mobileXorEmailValidator below
            },
            {
                validator: mobileXorEmailValidator()
            }
        );
        
        if (this.attendee.last_name) { // this is an edit
            this.attendeeForm.setValue({
                first_name: this.attendee.first_name,
                last_name: this.attendee.last_name,
                contactString: this.attendee.contactString,
                contactMethod: this.attendee.contactMethod,
                isAttending: this.attendee.isAttending                
            });
            console.log(this.attendeeForm);
        }
        else { // this is an adding of an attendee, so flag it accordingly
               /// however, this is also a new attendee so no Delete button is needed (Cancel does the same)
            this.attendee.isTypeAttendee = true;
            this.isAddition = true;
        }
    }

    ngAfterViewInit(){
        console.log('ngAfterViewInit');
        console.log(this.attendee);
        if (this.attendee.last_name) {
            if (this.attendee.contactMethod == 1) {
                this.preferredNumber.pn = this.attendee.contactString;
            }
        }
        /*
        if (this.attendeeForm.value.contactMethod == 1) {
            this.attendeeForm.value.contactString = this.preferredNumber.getPN_lim();
            console.log('here');
        } */
    }
    
    displayFormControlError(controlName: string): boolean {
     return this.attendeeForm.controls[controlName].invalid && 
         (this.attendeeForm.controls[controlName].dirty || this.attendeeForm.controls[controlName].touched);
    }
}

