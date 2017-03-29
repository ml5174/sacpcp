import {Component} from '@angular/core'
import {ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../lib/service/user';
import {NavController} from 'ionic-angular';
import {STRINGS} from '../../lib/provider/config';
import {TranslateService} from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';
import { ParentVerifyModal } from '../../modals/parent-verify-modal';

@Component({
  templateUrl: 'register-individual-profile.html'
})
export class RegisterIndividualProfilePage {

  @ViewChild(Content) content: Content;

  public key: string = '';
  public val: string = '';
  public errors: Array<string> = [];

  // Error booleans
  public firstnameerror: boolean = false;
  public lastnameerror: boolean = false;
  public birthdateerror:  boolean = false;
  public my_contactmethod_iderror:  boolean = false;
  public my_volunteertype_iderror:  boolean = false;
  public acceptedwaivererror: boolean = false;
  public acceptedpolicyerror: boolean = false;
  public com_opt_inerror: boolean = false;
  
  public mobilenumbererror: boolean = false;
  public emailerror: boolean = false;
  public parent_consenterror: boolean = false;

  public gendererror: boolean = false;
  public address1error: boolean = false;
  public address2error: boolean = false;
  public cityerror: boolean = false;
  public stateerror: boolean = false;
  public zipcodeerror:  boolean = false;
  public my_servicearea_iderror:  boolean = false;
  public my_referalsource_iderror:  boolean = false;
  public my_donationtype_iderror:  boolean = false;

  public ecfirstnameerror:  boolean = false;
  public eclastnameerror:  boolean = false;
  public ecrelationerror:  boolean = false;
  public ecmobilenumbererror:  boolean = false;
  public ecaltnumbererror:  boolean = false;

  public passworderror:  boolean = false;
  public password1error:  boolean = false;
  public password2error:  boolean = false;

  public relationships = [
    "Parent/Guardian",
    "Brother/Sister",
    "Relative",
    "Friend"
  ];

  public genders = [
    {id:"1", value: "Male"},
    {id:"2", value: "Female"},
    {id:"3", value: "Other"}
  ];

  // Other private variables
  public myProfile: any = {
    emergency_contact: {}
  };

  public availablePreferences: any = {};
  public myPreferences: any = {};
  public passwordForm: any = {};

  public formServiceAreas: Array<any> = [];

  public profileExists: boolean = false;

  public loadingOverlay;

  public showpassword: string = "password";

  public mobileNumberAreaCode = "";
  public mobileNumberPrefix = "";
  public mobileNumberLineNumber = "";

  public ecMobileNumberAreaCode = "";
  public ecMobileNumberPrefix = "";
  public ecMobileNumberLineNumber = "";

  public ecAltNumberAreaCode = "";
  public ecAltNumberPrefix = "";
  public ecAltNumberLineNumber = "";

  public selectedTab: string = "personal";

  // Constructor
  constructor(public nav: NavController,
              public userServices: UserServices,
              public translate: TranslateService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController) {
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
          console.log(this.myPreferences);
          this.availablePreferences = data[1];
          this.myProfile = data[2];

          this.translateToFormPreferences();

          this.profileExists = true;

          let defaultVolunteerType: string = "Individual";
          let defaultVolunteerTypeId: number = 1;
          for (let volunteerType of this.availablePreferences.volunteertypes) {
            if (volunteerType.name == defaultVolunteerType) {
              defaultVolunteerTypeId = volunteerType.id;
              break;
            }
          }

          if (!this.myProfile.emergency_contact) this.myProfile.emergency_contact = {};
          if (this.myProfile.tc_version == "") this.myProfile.tc_version = null;
          if (!this.myProfile.my_volunteertype_id) this.myProfile.my_volunteertype_id = defaultVolunteerTypeId;
          if (!this.myProfile.volunteertype) this.myProfile.volunteertype = defaultVolunteerType;

          this.translateToFormPhoneNumbers();

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
    //check if of age
    //if not, throw a modal up and ask some questions
    //otherwise continue
    var myAge = this.checkAge(this.myProfile.birthdate);
    //console.log("My age: " + myAge);
    if(myAge < 17){ //TODO:  Once there is a persistent variable that indicates this user has already submitted for parental verfication, stop doing this check.
    	//toss up a modal.
    	this.openModal(myAge);
    }else{
    this.updateProfile();
    }
    
  }
  
  checkAge(birthdate: string): number{
  	var enteredDate = new Date(birthdate);
  	var ageDifMs = Date.now() - enteredDate.getTime();
  	var ageDate = new Date(ageDifMs); 
  	return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
  openModal(age:number){
  	let modal = this.modalCtrl.create(ParentVerifyModal, {age: age});
  	modal.onDidDismiss(data => { 
  	console.log(data);
  	//set a varible here that indicates this profile is in a pending state
  	this.updateProfile(); //update this method to handle that pending state
  	});
  	modal.present();
  }

  updateProfile() {
    this.showLoading();
    this.clearErrors();
    this.cleanBooleans();
    this.translateFromFormPreferences();
    this.translateFromFormPhoneNumbers();

    let updateMyProfileObservable =  this.userServices.updateMyProfile(this.myProfile);
    let updateMyPreferencesObservable =  this.userServices.updateMyPreferences(this.myPreferences);
    let changeMyPasswordObservable = null;

    let observables = [updateMyProfileObservable, updateMyPreferencesObservable];

    // Only call change password if one or more of the form fields are entered    
    if (this.passwordForm.old_password ||  this.passwordForm.new_password1 || this.passwordForm.new_password2) {
      changeMyPasswordObservable = this.userServices.changePassword(this.passwordForm);
      observables.push(changeMyPasswordObservable);
    }

    Observable.forkJoin(observables)
      .subscribe(
          key => {
            this.presentToast("Profile saved.")
            this.hideLoading();
            this.passwordForm={};
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
    if (this.mobileNumberAreaCode || this.mobileNumberPrefix || this.mobileNumberLineNumber) {
      this.myProfile.mobilenumber = "1" + this.mobileNumberAreaCode + this.mobileNumberPrefix + this.mobileNumberLineNumber;
    } else {
      this.myProfile.mobilenumber = "";
    }

    if (this.ecMobileNumberAreaCode || this.ecMobileNumberPrefix || this.ecMobileNumberLineNumber) {
      this.myProfile.emergency_contact.mobilenumber = "1" + this.ecMobileNumberAreaCode + this.ecMobileNumberPrefix + this.ecMobileNumberLineNumber;
    } else {
      this.myProfile.emergency_contact.mobilenumber = "";
    }

    if (this.ecAltNumberAreaCode || this.ecAltNumberPrefix || this.ecAltNumberLineNumber) {
      this.myProfile.emergency_contact.altnumber = "1" + this.ecAltNumberAreaCode + this.ecAltNumberPrefix + this.ecAltNumberLineNumber;    
    } else {
      this.myProfile.emergency_contact.altnumber = "";
    }
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

        this.passworderror=false;
        this.password1error=false;
        this.password2error=false;
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

          if (key==='old_password') this.passworderror=true;
          if (key==='new_password1') this.password1error=true;
          if (key==='new_password2') this.password2error=true;

          if (key==='contact')  {
            let object = error[key];
            if (object.mobilenumber) {
              this.mobilenumbererror=true;
            }
            if (object.email) {
              this.emailerror=true;
            }
          }
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
    this.nav.popToRoot();
  }

  goToChangePassword() {
    this.nav.push(ChangePasswordPage);
  }

  showPassword() {
    if (this.showpassword === 'password') this.showpassword = 'text';
    else this.showpassword = 'password';
  }
  onClick(event){
  	var target = event.target.parentElement;
  	setTimeout(function(){
  	target.scrollIntoView(true);
  	}
  	, 100);
  	
  }
  presentPasswordPopover(ev) {

    let popover = this.popoverCtrl.create(PasswordPopover, {
    });

    popover.present({
      ev: ev
    });
  }

}
