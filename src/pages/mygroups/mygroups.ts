import {Component, ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../lib/service/user';
import {NavController,NavParams} from 'ionic-angular';
import {STRINGS} from '../../lib/provider/config';
import {TranslateService} from "@ngx-translate/core";
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';
import { ParentVerifyModal } from '../../modals/parent-verify-modal';
import { PhoneInput } from '../../lib/components/phone-input.component';
import { AccordionBox } from '../../lib/components/accordion-box';
import { AlertController } from 'ionic-angular';
import { CreateGroupPage } from '../create-group/create-group';
import { Organization } from '../../lib/model/organization';
import { OrganizationServices } from '../../lib/service/organization';

@Component({
  templateUrl: 'mygroups.html',
  providers: [OrganizationServices]
})

export class MyGroupsPage {

  @ViewChild(Content) content: Content;
  
  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];

  public loadingOverlay;  

  // Constructor
  constructor(public nav: NavController,
              public userServices: UserServices,
              public loadingController: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastController: ToastController,
              public orgServices: OrganizationServices,
              private popoverCtrl: PopoverController) {
  }

  

    ionViewDidLoad() {
      console.log("MyGroups: ionViewDidLoad");
    
      //let getMyGroupsObservable =  this.userServices.getMyGroups();
      
      this.clearErrors();
      this.cleanBooleans();
      this.showLoading(); 
    }

    ionViewWillEnter() {
      console.log("MyGroups: ionViewWillEnter");
      this.orgServices.getMyOrganizations().subscribe(function(response){
        var u = response;
        response.forEach(group => {
        //page.orgs.push(group.name);
        console.log("group"+ group.name);
        });
      })
    }
 

  presentToast(message: string) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  
  showLoading() {
    this.loadingOverlay = this.loadingController.create({
      content: 'Please wait...'
    });
    //this.loadingOverlay.present();
  }
  pushGroupPage()
  {
    this.nav.push(CreateGroupPage);
  }
  hideLoading() {
    this.loadingOverlay.dismiss();
  }
  
  cleanBooleans() {
    console.log("cleanBooleans");
  }

  clearErrors() {
    console.log("clearErrors");
    this.errors = [];

  }

  back() {
    this.nav.popToRoot();
  }

}