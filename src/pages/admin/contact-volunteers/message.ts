import { Component } from '@angular/core';
import { App, NavParams } from 'ionic-angular';
import { MessageServices } from '../../../lib/service/message';
import { UserServices } from '../../../lib/service/user';
import { ViewController } from 'ionic-angular';
import { HomePage } from '../../home/home';

@Component({
	templateUrl: 'message.html'
})

export class Message {
	public message:String = '';
	private users:Array<any>;
	private events:Array<any>;
	public sendMessageError:Boolean;

	constructor(params: NavParams,
				public viewCtrl:ViewController,
				private messageServices:MessageServices,
				private app:App) {
		if(params.get('users'))
			this.users = params.get('users');
		if(params.get('events'))
			this.events = params.get('events');
	}

	goHome() {
		this.viewCtrl.dismiss({'cancel':true});
		this.app.getRootNav().push(HomePage);
	}

	send() {
		if(this.users.length > 0) {    
			let body = {
				message: this.message,
				recipients: this.users,
				schedule_option: 2
            };
            console.log("body stringify: " + JSON.stringify(body));
			this.messageServices.sendMessageToUsersList(JSON.stringify(body)).subscribe(
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
