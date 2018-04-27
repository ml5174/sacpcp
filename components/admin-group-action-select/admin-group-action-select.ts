import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Contact } from '../../model/contact';
import { mobileXorEmailValidator } from '../../validators/mobilexoremailvalidator';
import { UserProfile } from '../../model/user-profile';

@Component({
    selector: 'admin-group-action-select',
    templateUrl: 'admin-group-action-select.html'
})

export class AdminGroupActionSelect {
    @Input() initialValue: number;
    @Output() selectionChanged: EventEmitter<number> = new EventEmitter();
    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.formGroup = this.formBuilder.group( // set up the validation
            {
                action: [this.initialValue, Validators.required]  
            }
        );
    }

    changeSelection() {
        this.selectionChanged.emit(this.formGroup.controls.action.value);
    }

    isDisabled(): boolean {
        return true; // TODO: will need check for 'active'
    }
}

