import { Component, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'contactMethod',
    templateUrl: 'contactMethod.component.html'
})

export class ContactMethod {
  @Input('email') pcmethod: string;
  @Input('emailValue') pcvalue: string;
  // @Input('smsMobileNumberAreaCode') mobileNumberAreaCode : string;
  // @Input('smsMobileNumberPrefix') mobileNumberPrefix : string;
  // @Input('smsMobileNumberLineNumber') mobileNumberLineNumber : string;
  @Input('pn') mobile: string;
  @ViewChild('phoneinput') mobilenumber: PhoneInput;
constructor(){}

}
