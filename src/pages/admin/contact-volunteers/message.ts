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
	public sendMessageError:Boolean;
    list: Array<any>[];
	listType: string;

	constructor(params: NavParams,
				public viewCtrl:ViewController,
				private messageServices:MessageServices,
				private app:App) {

		this.listType = params.get('listType');
		this.list = params.get('list');
		console.log("list: " + this.list);
	}

	cancel() {
		this.viewCtrl.dismiss({'cancel':true});
	}

	send() {   //TODO: figure out the proper way to handle 'this' so that the 
			   // three different API calls can be put into a variable
			   // for a cleaner implementation
		let payload = {
			'message': this.message,
			'schedule_option': 2
		}

		switch(this.listType) {
			case 'individual':
				payload['recipients'] = this.list;
				this.messageServices.sendMessageToUsersList(payload).subscribe(
					response => {
						console.log(response);
						this.viewCtrl.dismiss({
							'success': response, 
							'message': 'Sent message to selected volunteer(s).'
						});
					},
					error => {this.sendMessageError = true }
				);
				break;
			case 'groups':
			for(let group of this.list) {
				payload['event_id'] = group['id'];
				this.messageServices.sendMessageToGroup(group['id'], payload).subscribe(
					response => {
						console.log(response);
						this.viewCtrl.dismiss({
							'success': response, 
							'message': 'Sent message the volunteer(s) for each event.'
						});
					},
					error => {this.sendMessageError = true }
				);
				}				break;
			case 'events':
			default:
			    for(let event of this.list) {
					payload['event_id'] = event['id'];
					console.log('payload:' + payload);
					this.messageServices.sendMessageToEvent(event['id'], payload).subscribe(
						response => {
							console.log(response);
							this.viewCtrl.dismiss({
								'success': response, 
								'message': 'Sent message the volunteer(s) for each event.'
							});
						},
						error => {this.sendMessageError = true }
					);
					}
				break;
		}
	}
}
