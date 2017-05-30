import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessageServices } from '../../../lib/service/message';
import { UserServices } from '../../../lib/service/user';
import { ViewController } from 'ionic-angular';

@Component({
	templateUrl: 'message.html'
})

export class Message {
	public message:String;
	private users:Array<any>;
	private events:Array<any>;
	public emptyMessageError:Boolean;
	public sendMessageError:Boolean;

	constructor(params: NavParams,
				public nav:NavController,
				public viewCtrl:ViewController,
				private messageServices:MessageServices,
				private userServices:UserServices) {
		if(params.get('users'))
			this.users = params.get('users');
		if(params.get('events'))
			this.events = params.get('events');
	}

	back() {
		this.viewCtrl.dismiss({'cancel':true});
	}

	send() {
		if( this.message==='' && (this.users || this.events) ) {
			this.emptyMessageError = true;
		} else if(this.users) {
			let body = {
				'message': this.message,
				'recipients': this.users,
				'schedule_option': 5
			};
			this.messageServices.sendMessageToUsersList(body).subscribe(
				res => {
					console.log(res);
					this.viewCtrl.dismiss({'success': res, 'message': 'Sent message to selected volunteer(s).'});
				},
				err => this.sendMessageError = true
			);
		} else if(this.events) {
			for(var e of this.events)
				this.messageServices.sendMessageToEvent(e,{'message': this.message, 'schedule_option': 5}).subscribe(
					res => {
						console.log(res);
						this.viewCtrl.dismiss({'successResponse': res, 'message': 'Sent message to all volunteers for selected event(s).'});
					},
					err => this.sendMessageError = true
			);
		}
	}
}