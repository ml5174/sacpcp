import {FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {Component, Input} from '@angular/core';
import {Contact} from '../../model/contact';
import {mobileXorEmailValidator} from '../../validators/mobilexoremailvalidator';

@Component({
    selector: 'member-data-entry',
    templateUrl: 'member-data-entry.html'
})


export class MemberDataEntry {

    isActiveUser: boolean = false;
    formGroup: FormGroup;

    contact: Contact;
    testMember: Contact = {
    first_name: 'Milt',
    last_name: 'Donahue',
    status: 1,
    role: 1,
    contactString: "me@you.com",
    mobilenumber: 5555555555,
    email: "me@you.com",
    isAdmin:2,
    isActive: 1,
    ext_id: "",
    isContactSelected: false,
    isPhoneSelected: false,
    isEmailSelected: true
    };

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.contact = this.testMember;
        this.formGroup = this.formBuilder.group( // set up the validation
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
       );
        if (this.contact) { // this is an edit
            this.formGroup.setValue({
                firstName: this.contact.first_name,
                lastName: this.contact.last_name,
                contactString: this.contact.contactString,
                contactMethod: this.contact.isPhoneSelected ? 1 : this.contact.isEmailSelected ? 2 : 0,
                isAdmin: this.contact.isAdmin,
                isActive: this.contact.isActive                 
            });
        }
        else { // this is a blank member
            this.contact = new Contact();
        }
    }    
    
    deleteMember() {
        
    }

    isFormControlError(controlName: string, myFormGroup: FormGroup = this.formGroup): boolean {
     return false; //myFormGroup.controls[controlName].invalid && 
          //  myFormGroup.controls[controlName].dirty && 
        //    myFormGroup.controls[controlName].touched;
    }
}

