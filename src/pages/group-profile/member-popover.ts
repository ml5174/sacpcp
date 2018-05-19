import { ViewController, NavController, NavParams } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
    templateUrl: './member-popover.html'
})

export class MemberPopOver implements OnInit {

    public action: string = "";
    public record: any = {};
    userForm: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
        public navParams: NavParams, public formBuilder: FormBuilder) {

        this.action = navParams.get('action');
        this.record = navParams.get('record');
        if (this.record) {
            console.log("this.record exists: " + JSON.stringify(this.record));
            if (this.record.contact_method == null) { 
                this.record.contact_method = 'Email' 
            };
        }
    }
  
    ngOnInit(): void {
        this.userForm = this.formBuilder.group({

            email: [this.record.email, Validators.email],
            role: [this.record.role == 2 ? 1: this.record.role, Validators.required],
            active: [{value: this.record.status == 0, disabled: false}],
            mobilenumber: [this.record.mobilenumber],
            contact_method: [this.record.contact_method, Validators.compose([Validators.required])],
            first_name: [this.record.first_name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'),
            Validators.minLength(2), Validators.maxLength(30)])],

            last_name: [this.record.last_name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'),
            Validators.minLength(2), Validators.maxLength(30)])],
        },
            { validator: this.emailOrMobile.bind(this) }
        );    
    }

    public closeModal() {
        this.viewCtrl.dismiss(null);
    }

    public save() {
        
        this.record.first_name = this.userForm.controls.first_name.value;
        this.record.last_name = this.userForm.controls.last_name.value;
        this.record.email = this.userForm.controls.email.value;
        this.record.mobilenumber = this.userForm.controls.mobilenumber.value;
        this.record.contact_method = this.userForm.controls.contact_method.value;
        this.record.status = this.userForm.controls.active.value ? 0 : 1;
        this.record.role = this.userForm.controls.role.value;
        this.viewCtrl.dismiss(this.record);
    }

    public emailOrMobile(group: FormGroup) {
        var rec = group.value;
        if (!rec) {
            return null;
        }
        if (rec.contact_method == 'Email') {
            if (this.valid_email(rec.email)) {

                return null;
            }
            console.log("email validaton_fail");
        }

        if (rec.contact_method == 'Phone') {
            if (this.valid_mobile(rec.mobilenumber)) {

                return null;
            }
            console.log("phone validaton_fail");

        }

        console.log('Validation fail');
        return ({ email: { valid: false }, mobile: { valid: false } })
    }
    

    public valid_mobile(m) {
        if (m)
            if (m.length >= 10) {
                return true;
            }
        return false;
    }

    public valid_email(e) {
        if (e) {

            if (e.length > 7) {
                return true;
            }

            return false;
        }
        return false;
    }
}




