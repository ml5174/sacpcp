import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'phone-input-reactive',
    templateUrl: 'phone-input-reactive.html',
})

export class PhoneInputReactive {
	@Input() idsuffix;
	@Input() pn;
	public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
	private suffix: string;
	@Output() mobileValueChanged = new EventEmitter();
    @Output() mobileValueBlur = new EventEmitter();

	constructor() { }
	
	ngAfterViewInit(){
	this.suffix = this.idsuffix;
	}

	inputBlurred(event) {
		this.mobileValueBlur.emit(event);
	}
	
	getPN(){
		if (this.pn && this.pn!='') {
			return "1" + this.pn.replace(/\D+/g, '').slice(0,10);
		}
		return '';
	}

	emitMobileChanged(evt) {
        let isValid = this.pn.replace(/\D+/g, '').slice(0,10).length == 10;
 		this.mobileValueChanged.emit({pn: this.getPN(), valid: isValid});
	}
	
}
