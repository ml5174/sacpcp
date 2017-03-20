import {Component} from '@angular/core';
import {Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
 templateUrl: 'privacy-terms-modal.html'
 })

export class PrivacyTermsModal{
	constructor(public platform: Platform,
    	public params: NavParams,
    	public viewCtrl: ViewController) 
    {
 	}
 	
 	dismiss(){
 		this.viewCtrl.dismiss({'agree' : false});
 	}
 	
 	agree(){
 		this.viewCtrl.dismiss({'agree' : true});
 	}
}