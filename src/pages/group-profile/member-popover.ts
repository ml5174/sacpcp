import { ViewController, NavController, NavParams, AlertController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Component({
    templateUrl: './member-popover.html'
})

export class MemberPopOver implements OnInit {

    public action: string = "";
    public record: any = {};
    userForm: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
        public navParams: NavParams, public formBuilder: FormBuilder, public alertController: AlertController) {

        this.action = navParams.get('action');
        this.record = navParams.get('record');
        if (this.record) {
            if (this.record.contact_method == null) { 
                this.record.contact_method = 'Email' 
            };
        }
    }
  
    ngOnInit(): void {
        let disableEdit: boolean = this.record.ext_id && !this.record.ext_id.startsWith("VI"); 
        this.userForm = this.formBuilder.group({

            email: [{value: this.record.email, disabled: disableEdit}],
            role: [this.record.role == 2 ? 1: this.record.role, Validators.required],
            active: [{value: this.record.status == 0, disabled: false}, Validators.required],
            mobilenumber: [{value: this.record.mobilenumber, disabled: disableEdit}],
            contact_method: [{value: this.record.contact_method, disabled: disableEdit}, Validators.required],
            first_name: [{value: this.record.first_name, disabled: disableEdit}, Validators.compose([Validators.required, Validators.pattern('[\\.a-z A-Z]*'),
            Validators.minLength(2), Validators.maxLength(30)])],

            last_name: [{value: this.record.last_name, disabled: disableEdit}, Validators.compose([Validators.required, Validators.pattern('[\\.a-z A-Z]*'),
            Validators.minLength(2), Validators.maxLength(30)])],
        }
        );
        this.updateValidators(this.record.contact_method); 
        this.onContactMethodChange();  
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
    
    public delete() {
        let alert = this.alertController.create({
            title: 'Group Member Delete',
            message: '<div style="color: black; text-align: center">Press OK to delete this member from the group. Otherwise press Cancel.</div>',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'OK',
                    handler: () => {
                        this.viewCtrl.dismiss({delete: true});
                    }
                }
            ]
        });
        alert.present();
    }

    onContactMethodChange() {
        let page = this;
        page.userForm.controls.contact_method.valueChanges.subscribe(
           (contactMethod: string) => page.updateValidators(contactMethod));            
    }

    updateValidators(contactMethod: string) {
        this.userForm.controls.email.clearValidators();
        this.userForm.controls.mobilenumber.clearValidators();

        if (contactMethod == "Phone") {  //mobile
            this.userForm.controls.mobilenumber.setValidators([Validators.maxLength(11), Validators.minLength(10), Validators.required]);
        }
        else if (contactMethod == "Email") { //email
            this.userForm.controls.email.setValidators([Validators.required, Validators.email]);
        }
        this.userForm.controls.email.updateValueAndValidity();
        this.userForm.controls.mobilenumber.updateValueAndValidity();
    }
}




