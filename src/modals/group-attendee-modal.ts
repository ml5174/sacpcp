import {Component} from '@angular/core';
import {FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {ViewController, NavParams} from 'ionic-angular';
import {Member} from '../lib/model/member';

@Component({
    templateUrl: 'group-attendee-modal.html',
    selector: 'group-attendee-modal'
})
export class GroupAttendeeModal {
    attendee: Member;
    attendeeForm: FormGroup;
    isAddition: boolean = false; 
    

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
            mobilenumber: formModel.contactMethod == 1 ? formModel.contactString.replace(/\D+/g, '').slice(0,10) : null,
            email: formModel.contactMethod == 2 ? formModel.contactString : null,
            isAdmin: 0,
            isActive: 1,
            ext_id: this.attendee.ext_id   
        };
        return saveAttendee;
    }
    
    save() {
        this.attendee = this.prepareSaveAttendee();
        //console.log('During Save:\n' + this.attendee.mobilenumber);

        this.viewController.dismiss(this.attendee);
    }
    
    ngOnInit(): void {
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
        }
        else { // this is an adding of an attendee, so flag it accordingly
               /// however, this is also a new attendee so no Delete button is needed (Cancel does the same)
            this.attendee.isTypeAttendee = true;
            this.isAddition = true;
        }
    }
    
    displayFormControlError(controlName: string): boolean {
     return this.attendeeForm.controls[controlName].invalid && 
         (this.attendeeForm.controls[controlName].dirty || this.attendeeForm.controls[controlName].touched);
    }
}

export function mobileXorEmailValidator(): ValidatorFn {
    return(group: FormGroup): {[key: string]: any} => {
        let contactMethod = group.controls['contactMethod'].value;
        let control : AbstractControl = group.controls['contactString'];
        if(contactMethod == 1) {  //mobile
            control.clearValidators();
            control.setValidators(mobilePhoneValidator());
            return null        
        }
        else if(contactMethod == 2) { //email
            control.clearValidators();
            control.setValidators(Validators.email);
            return null;
        }
        else {
            return { noContactMethodSelected: "You must select a method for contacting you" };
        }
    }
}

export function mobilePhoneValidator(): ValidatorFn {
    return(control: AbstractControl): {[key: string]: any} => {
       let phoneEntry : string = control.value;
       let numberRegex: RegExp = /\d{10}/g;
       return ( numberRegex.test(phoneEntry.replace(/\D+/g, '').slice(0,10)) ) ? null : {inputType: 'mobile', errorCode: "Must be at least 10 digits"};
    }
}