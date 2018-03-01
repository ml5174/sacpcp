import {ValidatorFn, AbstractControl} from '@angular/forms';

export function mobilePhoneValidator(): ValidatorFn {
    return(control: AbstractControl): {[key: string]: any} => {
       let phoneEntry : string = control.value;
       let numberRegex: RegExp = /\d{10}/g;
       return ( numberRegex.test(phoneEntry.replace(/\D+/g, '').slice(0,10)) ) ? null : {inputType: 'mobile', errorCode: "Must be at least 10 digits"};
    }
}