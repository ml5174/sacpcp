import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Contact } from '../../model/contact';
import { mobileXorEmailValidator } from '../../validators/mobilexoremailvalidator';
import { UserProfile } from '../../model/user-profile';

@Component({
    selector: 'member-data-entry',
    templateUrl: 'member-data-entry.html'
})

export class MemberDataEntry {
    @Input() member: UserProfile;
    @Output() memberDeleted: EventEmitter<any> = new EventEmitter();
    isActiveUser: boolean = false;
    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        let role = (this.member.profile.role ? this.member.profile.role : 0);
        this.formGroup = this.formBuilder.group( // set up the validation
            {
                lastName: [this.member.profile.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
                contactString: this.member.profile.contactmethod == 2 ? this.member.profile.email : this.member.profile.mobilenumber,
                firstName: [this.member.profile.first_name, [Validators.required, Validators.maxLength(25)]],
                contactMethod: this.member.profile.contactmethod, // covered by mobileXorEmailValidator below
                isActive: ['1', Validators.required], //this is defaulted to 'Yes', and there is no way to 'unselect' (must be yes or no)
                role: [role, Validators.required]  
            },
            {
                validator: mobileXorEmailValidator()
            }
        );
    }

    isFormControlError(controlName: string, myFormGroup: FormGroup = this.formGroup): boolean {
        return myFormGroup.controls[controlName] && myFormGroup.controls[controlName].invalid &&
            myFormGroup.controls[controlName].dirty &&
            myFormGroup.controls[controlName].touched;
    }

    deleteMember() {
        //console.log("MemberDataEntry is deleting myself");
        this.memberDeleted.emit(this.member);
    }
    public isRequired(): boolean {
        return this.member.required;
    }
}

