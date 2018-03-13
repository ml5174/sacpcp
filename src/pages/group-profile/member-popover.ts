import { ViewController,NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './memberPopup.html'
  
    
})
    
   

export class MemberPopOver {
  
    
    public action: string="";
    public record: any ={};
    public page: any;
    
    constructor(public navCtrl: NavController, public viewCtrl : ViewController ,public navParams: NavParams
    
       ,public formBuilder:FormBuilder ) {
        
    this.action=navParams.get('action');
    this.record=navParams.get('record');
    if (this.record)
    {
        if (this.record.contact_method == null)
            { this.record.contact_method='Email'};
        if (this.record.active == null)
            { this.record.active=false};
            this.page=this;
     }
     }
    
    
    public closeModal(){
        this.viewCtrl.dismiss();
    }
 
  
   public userForm= this.formBuilder.group({
        
    email : [this.record.email],
    active : [this.record.active],
    mobilenumber:[this.record.mobilenumber],
     contact_method : [this.record.contact_method,Validators.compose([ Validators.required])],
     first_name: [this.record.first_name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), 
    Validators.minLength(3), Validators.maxLength(30)])],
         
    last_name: [this.record.last_name, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), 
    Validators.minLength(3), Validators.maxLength(30)])],
    
   
   
    },
   {validator: this.emailOrMobile.bind(this)}
   );
 
    public onSubmit (data)
    {
    console.log (data);
    this.viewCtrl.dismiss(data);
    }
 
 public emailOrMobile(group: FormGroup) {
    var rec=group.value;
    if (!rec)
    {
        return null;
    }
    console.log('Entering Validation',rec);
    if (rec.contact_method=='Email')
    {
        if (this.valid_email(rec.email))
        {
            
            return null;
        }
        console.log("email validaton_fail");
     }
    
    
    if (rec.contact_method == 'Phone')
    {
         if (this.valid_mobile(rec.mobilenumber))
        {
            
            return null;
        }
         console.log("phone validaton_fail");
        
     }
       
       console.log('Validation fail');
    return ({email:{valid:false},mobile:{valid:false}})
}
public closePopup ()
    {
     this.viewCtrl.dismiss();
    }
    
public valid_mobile(m)
    {
     if(m)
        if (m.length >=10)
        {
        return true;
         }
     return false;
    }

 public valid_email (e)
 {
   if (e){
   
    if (e.length >7)
    {
        return true;
     }
    
    return false;
  }
    return false;
 }
    

   
  
}
  
  


