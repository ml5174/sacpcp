import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'phone-input-reactive',
    templateUrl: 'phone-input-reactive.html',
})

export class PhoneInputReactive implements OnInit {
	@Input() phone: string;
	public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
	@Output() mobileValueChanged = new EventEmitter();
    private parentFormGroup: FormGroup;
    private formGroup: FormGroup;

	constructor(private parent: FormGroupDirective, private formBuilder: FormBuilder) { }
	
	ngOnInit(){
        this.parentFormGroup = this.parent.form;
        this.parentFormGroup.removeControl('phoneGroup');
        this.parentFormGroup.removeControl('contactString');
        this.formGroup = this.formBuilder.group({
            phoneControl: [this.phone, [Validators.required, Validators.pattern("\\([1-9]\\d\\d\\) \\d\\d\\d-\\d\\d\\d\\d")]]

        })
        this.parentFormGroup.addControl('phoneGroup', this.formGroup);
    }
	
	getPhone(): String {
		if (this.formGroup.controls.phoneControl.value && this.formGroup.controls.phoneControl.value != '') {
			return "1" + this.formGroup.controls.phoneControl.value.replace(/\D+/g, '').slice(0,10);
		}
		return '';
	}

	emitMobileValueChanged() {
        //let isValid = this.formGroup.controls.phoneNumber.value.replace(/\D+/g, '').slice(0,10).length == 10;
 		this.mobileValueChanged.emit(this.getPhone());
	}
}