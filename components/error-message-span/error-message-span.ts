import { Component, Input } from '@angular/core'

@Component({
 selector: 'error-message-span',
  templateUrl: 'error-message-span.html'
})

export class ErrorMessageSpan {
    @Input() errorText: string; //TODO maybe allow something more complex than text
    @Input() iconType: string = "alert";
	constructor() { }
}