import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { Component, ViewChild, Input, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { UserProfile } from '../../model/user-profile';
import { PhoneInputReactive } from '../phone-input-reactive';

@Component({
    selector: 'member-data-entry',
    templateUrl: 'member-data-entry.html'
})

export class MemberDataEntry implements OnInit, AfterViewInit {

    @Input() member: UserProfile;
    @Output() memberDeleted: EventEmitter<any> = new EventEmitter();

    //public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    isActiveUser: boolean = false;
    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        let page = this;
        let role = (page.member.profile.role ? page.member.profile.role : 0);
        page.formGroup = page.formBuilder.group( // set up the validation
            {
                lastName: [page.member.profile.last_name, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
                firstName: [page.member.profile.first_name, [Validators.required, Validators.maxLength(25)]],
                contactMethod: [page.member.profile.contactmethod, Validators.required], 
                isActive: ['1', Validators.required], //this is defaulted to 'Yes', and there is no way to 'unselect' (must be yes or no)
                role: [role, Validators.required]
            }
        );
        if(page.member.profile.contactmethod == 2) {
            page.initEmailControl();
        }
        page.formGroup.controls.contactMethod.valueChanges.subscribe((val) => {
              if(val == 2) {
                  page.formGroup.removeControl('phoneGroup');
                  page.initEmailControl();
                }
            });
    }

    initEmailControl() {
        const contactString = new FormControl(this.member.profile.email, Validators.email);
        this.formGroup.addControl('contactString', contactString);        
    }
    
    ngAfterViewInit(): void {
        //throw new Error("Method not implemented.");
    }
    setContactMethodValidation(contactmethod: number) {
        let validator = null;
        if(contactmethod == 1) {
            validator = Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        }
        else { //2 is the only other value
            validator = Validators.compose([Validators.required, Validators.email]);
        }
        this.formGroup.controls.contactString.setValidators(validator);
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

