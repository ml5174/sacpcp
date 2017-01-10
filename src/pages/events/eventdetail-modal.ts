import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'eventdetail_modal.html'
})

export class EventDetailModal {
    eventId: String;

    constructor(params: NavParams,
                public viewCtrl: ViewController) {

        this.viewCtrl = viewCtrl;
        console.log(params);
        this.eventId = params.data;
        console.log(this.eventId);
    }
    dismiss() {
      this.viewCtrl.dismiss();
    }
}