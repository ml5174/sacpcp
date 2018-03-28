import {mobilePhoneValidator} from './mobilephonevalidator';
import {FormGroup, Validators, ValidatorFn, AbstractControl} from '@angular/forms';

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
