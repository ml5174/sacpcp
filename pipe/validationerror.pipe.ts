import {Pipe, PipeTransform} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
/**
 *  this pipe will receive a JSON ValidationError (or null) and transform it to 
 *    a proper user error message.
 *    
 *  will possibly move the message table when discussed w/devs
 * 
 */
@Pipe({name: 'val_err_pipe'})
export class ValidationErrorPipe {
    
validationMessages = {
        first_name: {
            required: 'Required',
            minlength: 'Must be at least 1 character',
            maxlength: 'Cannot be more than 25 characters long.',
            pattern: 'Must contain only letters and spaces',
            default: 'Invalid entry'
        },
        last_name: {
            required: 'Required',
            minlength: 'Must be at least 2 characters long',
            maxlength: 'Cannot be more than 25 characters long',
            pattern: 'Last Name must contain only letters'
        },
        mobile: {
            default: 'Invalid Mobile Number',
            required: 'Mobile Number Required',
            minlength: 'Last Name must be at least 2 characters long',
            maxlength: 'Last Name cannot be more than 25 characters long',
            pattern: 'Last Name must contain only letters'
        },
        email: {default: 'Invalid Email Address'},
        unknown: {default: 'Unsupported Form Error'}
    };    
    
    transform(valError: any, inputType: string): string {
        let retVal : string = null; // case 1) no error
        if(<ValidationErrors>valError){ 
            try {
                console.log("ve: \n" + JSON.stringify(valError));
                retVal = this.validationMessages['unknown']['default']; // case 2 - default error message (Ideally shouldn't happen)
                // case 3 - fully customized error message
                if ( valError.hasOwnProperty('inputType') && valError.hasOwnProperty('errorCode') ) {
                    console.log('case 3')
                    retVal = valError['errorCode'];
                }
                // case 4 - directed (via pipe parameter) error message
                else if (inputType && this.validationMessages[inputType]) {
                    console.log('case 4');
                    for (let errorCode in valError) {
                        console.log('4: errorCode: ' + errorCode);
                        if (valError.hasOwnProperty(errorCode) && this.validationMessages[inputType].hasOwnProperty(errorCode.toLowerCase())) {
                            retVal = this.validationMessages[inputType][errorCode];
                            break;
                        }
                    }            
                }              
                else {
                   console.log('case 5');
                   // console.log("else - In <ValidationErrors>validationError");
                    for(let errorCode in valError) { 
                        if (valError.hasOwnProperty(errorCode) && this.validationMessages.hasOwnProperty(errorCode.toLowerCase())) {
                            retVal = this.validationMessages[errorCode.toLowerCase()]['default'];
                            break;
                        }
                    }
                }
            } catch(err) {
                console.log('Error:\n' + err);
            }
        }
        console.log("final retVal: \n" + retVal);
        return retVal;
    }
    
}

