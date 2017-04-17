import { Component, Input } from '@angular/core';
@Component({
    selector: 'contactMethod',
    templateUrl: 'contactMethod.component.html'
})

export class ContactMethod{
@Input('email') pcmethod: string;
@Input('emailValue') pcvalue: string;
// @Input('smsMobileNumberAreaCode') mobileNumberAreaCode : string;
// @Input('smsMobileNumberPrefix') mobileNumberPrefix : string;
// @Input('smsMobileNumberLineNumber') mobileNumberLineNumber : string;
@Input('smsMobileNumber') mobileNumber : string;

constructor(){
  }
}