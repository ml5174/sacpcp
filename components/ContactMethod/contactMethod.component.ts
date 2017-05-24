import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PhoneInput } from '../phone-input.component';

@Component({
    selector: 'contactMethod',
    templateUrl: 'contactMethod.component.html'
})

export class ContactMethod {
  @Input('email') pcmethod: string;
  @Input('emailValue') pcvalue: string;
  @Input('pn') mobile: string;
  @ViewChild('phoneinput') mobilenumber: PhoneInput;
  @Output() methodUpdated = new EventEmitter();
  @Output() emailUpdated = new EventEmitter();
  @Output() mobileUpdated = new EventEmitter();
  @Output() contactMethodBlur = new EventEmitter();
constructor(){}
  pcMethodChange(evt) {
    // clear the email value when its changed to sms and emit change event
    if (evt == 'sms') {
      this.pcvalue = '';
    }
    this.methodUpdated.emit(evt);
  }

  blur(event) {
    this.contactMethodBlur.emit(event);
  }

  emailChanged(evt) {
    //console.log("email changed", evt);
    this.emailUpdated.emit(evt);
  }

  mobileChanged(newNumber) {
    //console.log("mobile changed from contactMethod Component", newNumber);
    this.mobileUpdated.emit(newNumber);
  }
}
