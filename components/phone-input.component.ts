import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'phone-input',
    templateUrl: 'phone-input.component.html',
})

export class PhoneInput {
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
		if (this.pn) {
			return "1" + this.pn.replace(/\D+/g, '').slice(0,10);
		}
		return '';
	}

	emitMobileChanged(evt) {
		//console.log("emitting mobile change", this.getPN());
		this.mobileValueChanged.emit(this.getPN());
	}
	
}
