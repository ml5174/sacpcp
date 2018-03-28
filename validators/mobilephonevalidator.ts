import {ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';

export function mobilePhoneValidator(): ValidatorFn {
    return(control: AbstractControl): {[key: string]: any} => {
       let retval : ValidationErrors = {
           inputType: 'mobile', 
           errorCode: "Must be at least 10 digits"};
       if(control.value) {
           let phoneEntry : string = control.value;
           let numberRegex: RegExp = /\d{10}/g;
           if(numberRegex.test(phoneEntry.replace(/\D+/g, '').slice(0,10))) {
               retval = null;
           }   
       }
       return retval;
    }
}