import {Component} from '@angular/core';
import {Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
 templateUrl: 'parent-verify-modal.html'
 })

export class ParentVerifyModal{
	private childAge: number;
	private email: string;
	constructor(public platform: Platform,
    	public params: NavParams,
    	public viewCtrl: ViewController) 
    {
   		this.childAge = this.params.get('age');
 	}
 	
 	dismiss(){
 		this.viewCtrl.dismiss();
 	}
 	
 	submitParentInfo(){
 		//do fancy stuff here
 		//set a variable back in the previous page that this profile is pending (or just do it in the db)
 		//dismiss this modal
 		this.viewCtrl.dismiss({'example return data' : 'from the modal'});
 		//continue the save procedure
 	}
}