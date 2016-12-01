import {Component} from '@angular/core'
import {ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import {TranslateService} from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';

@Component({
  templateUrl: 'register-individual-profile.html'
})
export class RegisterIndividualProfilePage {

  @ViewChild(Content) content: Content;

  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];

  // Error booleans
  private firstnameerror: boolean = false;
  private lastnameerror: boolean = false;
  private birthdateerror:  boolean = false;
  private my_contactmethod_iderror:  boolean = false;
  private my_volunteertype_iderror:  boolean = false;
  private acceptedwaivererror: boolean = false;
  private acceptedpolicyerror: boolean = false;
  private com_opt_inerror: boolean = false;
  
  private mobilenumbererror: boolean = false;
  private emailerror: boolean = false;
  private parent_consenterror: boolean = false;

  private gendererror: boolean = false;
  private address1error: boolean = false;
  private address2error: boolean = false;
  private cityerror: boolean = false;
  private stateerror: boolean = false;
  private zipcodeerror:  boolean = false;
  private my_servicearea_iderror:  boolean = false;
  private my_referalsource_iderror:  boolean = false;
  private my_donationtype_iderror:  boolean = false;

  private ecfirstnameerror:  boolean = false;
  private eclastnameerror:  boolean = false;
  private ecrelationerror:  boolean = false;
  private ecmobilenumbererror:  boolean = false;
  private ecaltnumbererror:  boolean = false;

  private relationships = [
    "Parent/Guardian",
    "Brother/Sister",
    "Relative",
    "Friend"
  ];

  private genders = [
    {id:"1", value: "Male"},
    {id:"2", value: "Female"},
    {id:"3", value: "Other"}
  ];

  // Other private variables
  private myProfile: any = {
    emergency_contact: {}
  };

  private availablePreferences: any = {};
  private myPreferences: any = {};

  private formServiceAreas: Array<any> = [];

  private profileExists: boolean = false;

  private loadingOverlay;

  private showpassword: string = "password";

  private mobileNumberAreaCode = "";
  private mobileNumberPrefix = "";
  private mobileNumberLineNumber = "";

  private ecMobileNumberAreaCode = "";
  private ecMobileNumberPrefix = "";
  private ecMobileNumberLineNumber = "";

  private ecAltNumberAreaCode = "";
  private ecAltNumberPrefix = "";
  private ecAltNumberLineNumber = "";

  selectedTab: string = "personal";

  // Constructor
  constructor(private nav: NavController,
              private userServices: UserServices,
              private translate: TranslateService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private popoverCtrl: PopoverController) {

  }

  // On initialization, get the latest info from the server
  ngOnInit() {
    let getMyProfileObservable =  this.userServices.getMyProfile()
    let getMyPreferencesObservable =  this.userServices.getMyPreferences()
    let getAvailablePreferencesObservable =  this.userServices.getAvailablePreferences()

    this.clearErrors();
    this.cleanBooleans();
    this.showLoading();

    // Get profile and preferences too
    Observable.forkJoin([getMyPreferencesObservable, getAvailablePreferencesObservable, getMyProfileObservable])
        .subscribe(data => {
          this.myPreferences = data[0];
          this.availablePreferences = data[1];
          this.myProfile = data[2];

          this.translateToFormPreferences();

          this.profileExists = true;
          if (!this.myProfile.emergency_contact) this.myProfile.emergency_contact = {};
          if (this.myProfile.tc_version == "") this.myProfile.tc_version = null;
          if (!this.myProfile.my_volunteertype_id) this.myProfile.my_volunteertype_id = 7;

          this.translateToFormPhoneNumbers();

          console.log(this.myPreferences);
          console.log(this.availablePreferences);
          this.hideLoading();
        }, err => {
          this.hideLoading();
          console.log(err);
        });
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
    this.loadingOverlay.present();
  }

  hideLoading() {
    this.loadingOverlay.dismiss();
  }

  register() {
    this.updateProfile();
  }

  updateProfile() {
    this.showLoading();
    this.clearErrors();
    this.cleanBooleans();
    this.translateFromFormPreferences();
    this.translateFromFormPhoneNumbers();

    let updateMyProfileObservable =  this.userServices.updateMyProfile(this.myProfile);
    let updateMyPreferencesObservable =  this.userServices.updateMyPreferences(this.myPreferences);

    Observable.forkJoin([updateMyProfileObservable, updateMyPreferencesObservable])
      .subscribe(
          key => {
            this.presentToast("Profile saved.")
            this.hideLoading();
            //this.key = key;
          }, 
          err => { 
            this.presentToast("Error saving profile.")
            this.hideLoading();
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
  }

  cleanBooleans() {
    this.myProfile.accepted_policy = (this.myProfile.accepted_policy) ? 1 : 0;
    this.myProfile.accepted_waiver = (this.myProfile.accepted_waiver) ? 1 : 0;
    this.myProfile.comm_opt_in = (this.myProfile.comm_opt_in) ? 1 : 0;
    this.myProfile.tc_version = (this.myProfile.tc_version) ? 1 : null;
    this.myProfile.parent_consent = (this.myProfile.parent_consent) ? 1 : 0;
  }
  
  isServiceAreaInMyPreferences(id: number) {
    let serviceAreas = this.myPreferences.serviceareas;
    for (let serviceArea of serviceAreas) {
      if (serviceArea.servicearea_id == id) return true;
    }
    return false;
  }

  translateToFormPhoneNumbers() {
    // Clear all parsed numbers
    this.mobileNumberAreaCode = "";
    this.mobileNumberPrefix = "";
    this.mobileNumberLineNumber = "";

    this.mobileNumberAreaCode = "";
    this.mobileNumberPrefix = "";
    this.mobileNumberLineNumber = "";

    this.mobileNumberAreaCode = "";
    this.mobileNumberPrefix = "";
    this.mobileNumberLineNumber = "";

    // Parse profile mobile number
    if (this.myProfile.mobilenumber && this.myProfile.mobilenumber.length == 11) {
      this.mobileNumberAreaCode = this.myProfile.mobilenumber.substring(1, 4);
      this.mobileNumberPrefix = this.myProfile.mobilenumber.substring(4, 7);
      this.mobileNumberLineNumber = this.myProfile.mobilenumber.substring(7, 11);
    }
    // Parse emergency contact mobile number
    if (this.myProfile.emergency_contact.mobilenumber && this.myProfile.emergency_contact.mobilenumber.length == 11) {
      this.ecMobileNumberAreaCode = this.myProfile.emergency_contact.mobilenumber.substring(1, 4);
      this.ecMobileNumberPrefix = this.myProfile.emergency_contact.mobilenumber.substring(4, 7);
      this.ecMobileNumberLineNumber = this.myProfile.emergency_contact.mobilenumber.substring(7, 11);
    }
    // Parse emergency contact alternate number
    if (this.myProfile.emergency_contact.altnumber && this.myProfile.emergency_contact.altnumber.length == 11) {
      this.ecAltNumberAreaCode = this.myProfile.emergency_contact.altnumber.substring(1, 4);
      this.ecAltNumberPrefix = this.myProfile.emergency_contact.altnumber.substring(4, 7);
      this.ecAltNumberLineNumber = this.myProfile.emergency_contact.altnumber.substring(7, 11);
    }
  }

  translateFromFormPhoneNumbers() {
    this.myProfile.mobilenumber = "1" + this.mobileNumberAreaCode + this.mobileNumberPrefix + this.mobileNumberLineNumber;
    this.myProfile.emergency_contact.mobilenumberr = "1" + this.ecMobileNumberAreaCode + this.ecMobileNumberPrefix + this.ecMobileNumberLineNumber;
    this.myProfile.emergency_contact.altnumber = "1" + this.ecAltNumberAreaCode + this.ecAltNumberPrefix + this.ecAltNumberLineNumber;    
  }

  translateToFormPreferences() {
    // empty the form array
    this.formServiceAreas = [];

    // Add all available preferences, and for those in "myPreferences.serviceareas", set the selected value to true
    let serviceAreas = this.availablePreferences.serviceareas;
    for (let serviceArea of serviceAreas) {
      let selected = this.isServiceAreaInMyPreferences(serviceArea.id) ? true : false;
      serviceArea.selected = selected; 
      this.formServiceAreas.push(serviceArea);
    }

    console.log(this.formServiceAreas);
  }

  translateFromFormPreferences() {
    // Start with empty serviceareas list in myPreferences
    this.myPreferences.serviceareas = [];

    // For every item on the form that is selected, add it to myPreferences
    let formServiceAreas = this.formServiceAreas;
    for (let serviceArea of formServiceAreas) {
      if (serviceArea.selected) {
        let newServiceArea = {
          servicearea_id: serviceArea.id
        };
        this.myPreferences.serviceareas.push(newServiceArea); 
      }
    }
    console.log(this.myPreferences.serviceareas);
    
  }

  clearErrors() {
        this.errors = [];

        this.firstnameerror=false;
        this.lastnameerror=false;
        this.birthdateerror=false;
        this.my_contactmethod_iderror=false;
        this.my_volunteertype_iderror=false;
        this.acceptedwaivererror=false;
        this.acceptedpolicyerror=false;
        this.com_opt_inerror=false;

        this.mobilenumbererror=false;
        this.emailerror=false;
        this.parent_consenterror=false;

        this.gendererror=false;
        this.address1error=false;
        this.address2error=false;
        this.cityerror=false;
        this.stateerror=false;
        this.zipcodeerror=false;
        this.my_servicearea_iderror=false;
        this.my_referalsource_iderror=false;
        this.my_donationtype_iderror=false;

        this.ecfirstnameerror=false;
        this.eclastnameerror=false;
        this.ecrelationerror=false;
        this.ecmobilenumbererror=false;
        this.ecaltnumbererror=false;
  }
  
  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
//          this[key + "error"] = true;
          if (key==='first_name') this.firstnameerror=true;
          if (key==='last_name') this.lastnameerror=true;
          if (key==='birthdate') this.birthdateerror=true;
          if (key==='my_contactmethod_id') this.my_contactmethod_iderror=true;
          if (key==='my_volunteertype_id') this.my_volunteertype_iderror=true;
          if (key==='acceptedwaiver') this.acceptedwaivererror=true;
          if (key==='acceptedpolicy') this.acceptedpolicyerror=true;
          if (key==='com_opt_in') this.com_opt_inerror=true;

          if (key==='mobilenumber') this.mobilenumbererror=true;
          if (key==='email') this.emailerror=true;
          if (key==='parent_consent') this.parent_consenterror=true;

          if (key==='gender') this.gendererror=true;
          if (key==='address1') this.address1error=true;
          if (key==='address2') this.address2error=true;
          if (key==='city') this.cityerror=true;
          if (key==='state') this.stateerror=true;
          if (key==='zipcode') this.zipcodeerror=true;
          if (key==='my_servicearea_id') this.my_servicearea_iderror=true;
          if (key==='my_referalsource_id') this.my_referalsource_iderror=true;
          if (key==='my_donationtype_id') this.my_donationtype_iderror=true;

          if (key==='emergency_contact')  {
            let object = error[key];
            if (object.mobilenumber) {
              this.ecmobilenumbererror=true;
            }
            if (object.altnumber) {
              this.ecaltnumbererror=true;
            }
          }
          if (key==='emergency_contact_first_name') this.ecfirstnameerror=true;
          if (key==='emergency_contact_last_name') this.eclastnameerror=true;
          if (key==='emergency_contact_relation') this.ecrelationerror=true;
        }
      }
      this.content.scrollToTop();
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
      this.content.scrollToTop();
    }

  }

  back() {
    this.nav.pop();
  }

  goToChangePassword() {
    this.nav.push(ChangePasswordPage);
  }

  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
  }
  presentPasswordPopover(ev) {

    let popover = this.popoverCtrl.create(PasswordPopover, {
    });

    popover.present({
      ev: ev
    });
  }

}
