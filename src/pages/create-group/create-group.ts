
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CancelGroupAddPopover } from '../../popover/cancel-groupadd';
import { PopoverController,ViewController,App,AlertController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { UserServices } from '../../lib/service/user';
import { OrganizationServices } from '../../lib/service/Organization';
import {HomePage} from '../home/home';
import {Organization} from '../../lib/model/organization'
import {Contact} from '../../lib/model/contact'
import { AutocompleteQueryMediator, BindQueryProcessorFunction } from '@brycemarshall/autocomplete-ionic';
import { CityQueryProvider } from '../../lib/city-query-provider';
import { Helper } from '../../lib/helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';





/**
 * Generated class for the CreateGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
  providers: [OrganizationServices]
})
export class CreateGroupPage {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Navbar) navBar: Navbar;
  public rowNum: number
  public isContactSelected: boolean
  public orgRequest: Organization
  public rows: Array<Contact> = []
  createGroupForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, 
    public userServices: UserServices, public formBuilder: FormBuilder, public orgServices: OrganizationServices, public popoverCtrl: PopoverController, public alertCtrl: AlertController) {
      this.orgRequest = new Organization();
   this.orgRequest.name = '';
   this.orgRequest.description = '';
   this.orgRequest.group = '';
    }
  public addMember(): void {
    if (this.rows[0].firstname ===''
        ||this.rows[0].lastname ==='' 
        ||this.rows[0].contactString === false )
        {
          let alert = this.alertCtrl.create({
            title: 'Incomplete Member Information',
            message: 'Please finish filling out the current row before adding another.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  
                }
              }
            ]
          });
          alert.present();
        }
        else{
    this.rows.unshift({firstname:'',lastname:'',isAdmin: 0, isActive: 0, 
                      contactString: false, isContactSelected: false, isPhoneSelected: false, isEmailSelected: false, mobilenumber: '',email:''});
         }
  }
  public cancel(ev)
  {
    this.presentConfirm();
          // let popover = this.popoverCtrl.create(CancelGroupAddPopover, {
          // });
      
          // popover.present({
          //   ev: ev
          // });
        
  }
  flipBoolean(contact, index)
  {
    if (contact!==''&&contact!==null&&contact!==undefined)
    {
     
      if(contact ==="Phone"){
        this.rows[index].isPhoneSelected = true;
        this.rows[index].isEmailSelected = false;
      }
      if (contact ==="Email"){
        this.rows[index].isEmailSelected = true;
        this.rows[index].isPhoneSelected = false;
      }
    
    }

  }
  addGroup()
  {
   var members = this.rows;
    var org = this.orgRequest;
    var organization ={organization};
    organization.organization = org;
    organization.members = members;
    var jsons = JSON.stringify(organization);
    
    var user = this.userServices.user;
    this.orgServices.createOrganization(jsons).subscribe( function(response){
      var u = response;
    }
    )

    

  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Leave This Page',
      message: 'Do you want to continue without creating this group?',
      buttons: [
        {
          text: 'No, Stay Here',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
  presentFinishedGroup() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Finished Group',
      message: 'Your request has been submitted to the Salvation Army. You will be notified when it is approved.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    alert.present();
  }
  trackByIndex(index: number, value: number) {
    return index;
  }
  submit()
  {
    this.presentFinishedGroup();
  }
  ionViewDidLoad() {
    var orgRequest = this.orgRequest;
    var user = this.userServices.user;
    this.rows.push({firstname: user.profile.first_name,
      lastname:user.profile.last_name,isAdmin: 2, contactString: user.profile.contactmethod_name,
       isActive: user.profile.active, mobilenumber: user.profile.mobilenumber, email:user.profile.email, isContactSelected:false,isEmailSelected:user.profile.contactmethod_name==="Email",isPhoneSelected:user.profile.contactmethod_name==="Phone"})
    this.addMember();
    console.log('ionViewDidLoad CreateGroupPage');
  }

}
