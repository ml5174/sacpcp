import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { AlertController, NavController, App } from 'ionic-angular';
import { NgModel } from '@angular/forms';
import { OrganizationServices } from '../../lib/service/organization';

@Component({
    templateUrl: 'add-attendees-modal.html',
})


export class AddAttendeesModal {
    public orgData:Array<any> = [];
    private myOrgs;
    private orgContactData:Array<any> = [];
    private orgContacts;
    private isGroupAdmin;
    private eventData;
    selectedMembers;
    signuptype = 'individual';
    optionSelected = false;
    showMembers = false;
    showGroups = false;
    submitText = "Next";
    selectedGroup;
    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public toastController: ToastController,
        public appCtrl: App,
        public navController: NavController) {
        this.viewCtrl = viewCtrl;
        this.myOrgs = [];
        this.selectedMembers = [];
        this.eventData = params.get('event_data')
    }

    ngOnInit() {
        // console.log(this.eventData);
    }

    ionViewWillEnter() {
       // console.log("Entered the eventSignup Modal");
        this.loadData();
    }
    ionViewDidEnter(){
       // console.log("Admin:"+ this.isGroupAdmin);
       // console.log("MyOrgs:"+ JSON.stringify(this.myOrgs));


    }

    loadData() {

        var page = this;

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
