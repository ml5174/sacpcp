import { ViewController,NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './memberPopup.html'
  
    
})
    
   

export class MemberPopOver {
  
  public member = {
      first_name:"",
      
      last_name:"",
      
      email:"",
      phone:"",
      status: 0,
      exit_id: "",
      role:0,
      contact_method: ''
      };
    

    
    constructor(public navCtrl: NavController, public viewCtrl : ViewController ,public navParams: NavParams
    
       ,public formBuilder:FormBuilder ) {
        }
    
    public closeModal(){
        this.viewCtrl.dismiss();
    }
 
 
  
   public userForm= this.formBuilder.group({
     first_name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), 
    Validators.minLength(3), Validators.maxLength(30)])],
         
    last_name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), 
    Validators.minLength(3), Validators.maxLength(30)])]
    
    });
  
}
  
  


