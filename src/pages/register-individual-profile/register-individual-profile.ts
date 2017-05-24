import {Component, ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../lib/service/user';
import {NavController} from 'ionic-angular';
import {STRINGS} from '../../lib/provider/config';
import {TranslateService} from "ng2-translate/ng2-translate";
import { ChangePasswordPage } from '../change-password/change-password';
import { Content, LoadingController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { PasswordPopover } from '../../popover/password';
import { ParentVerifyModal } from '../../modals/parent-verify-modal';
import { PhoneInput } from '../../lib/components/phone-input.component';
import { AccordionBox } from '../../lib/components/accordion-box';

@Component({
  templateUrl: 'register-individual-profile.html'
})
export class RegisterIndividualProfilePage {

  @ViewChild(Content) content: Content;
  @ViewChild('preferredNumber') preferredNumber : PhoneInput;
  @ViewChild('emergencyNumber') emergencyNumber : PhoneInput;
  @ViewChild('emergencyAlternate') emergencyAlternate : PhoneInput;

  //In order to expand & collapse accordion boxes if there are errors within them,
  // we need to be able to reference them.
  @ViewChild('accordionMyCredentials') accordionMyCredentials : AccordionBox;
  @ViewChild('accordionPreferredContact') accordionPreferredContact : AccordionBox;
  @ViewChild('accordionEmergencyContact') accordionEmergencyContact : AccordionBox;
  @ViewChild('accordionVolunteerTypes') accordionVolunteerTypes : AccordionBox;
  @ViewChild('accordionPreferredLocations') accordionPreferredLocations : AccordionBox;
  @ViewChild('accordionServiceAreas') accordionServiceAreas : AccordionBox;
  @ViewChild('accordionChangePassword') accordionChangePassword : AccordionBox;
  
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

  public requiredFieldError: boolean = false;

  // Error values
  public firstnameerrorvalue: string = "";
  public lastnameerrorvalue: string = "";
  public birthdateerrorvalue:  string = "";
  public my_contactmethod_iderrorvalue:  string = "";
  public my_volunteertype_iderrorvalue:  string = "";
  public acceptedwaivererrorvalue: string = "";
  public acceptedpolicyerrorvalue: string = "";
  public com_opt_inerrorvalue: string = "";
  
  public mobilenumbererrorvalue: string = "";
  public emailerrorvalue: string = "";
  public parent_consenterrorvalue: string = "";

  public gendererrorvalue: string = "";
  public address1errorvalue: string = "";
  public address2errorvalue: string = "";
  public cityerrorvalue: string = "";
  public stateerrorvalue: string = "";
  public zipcodeerrorvalue:  string = "";
  public my_servicearea_iderrorvalue:  string = "";
  public my_referalsource_iderrorvalue:  string = "";
  public my_donationtype_iderrorvalue:  string = "";

  public ecfirstnameerrorvalue:  string = "";
  public eclastnameerrorvalue:  string = "";
  public ecrelationerrorvalue:  string = "";
  public ecmobilenumbererrorvalue:  string = "";
  public ecaltnumbererrorvalue:  string = "";

  public passworderrorvalue:  string = "";
  public password1errorvalue:  string = "";
  public password2errorvalue:  string = "";


  public relationships = [
    "Parent/Guardian",
    "Spouse",
    "Relative",
    "Friend"
  ];

  public genders = [
    {id:"1", value: "Male"},
    {id:"2", value: "Female"}
  ];

  // Other private variables
  public myProfile: any = {
    emergency_contact: {}
  };

  public availablePreferences: any = {};
  public myPreferences: any = {};
  public passwordForm: any = {};

  public formServiceAreas: Array<any> = [];
  public formLocations: Array<any> = [];

  public profileExists: boolean = false;

  public loadingOverlay;

  public showpassword: string = "password";

  // public mobileNumberAreaCode = "";
  // public mobileNumberPrefix = "";
  // public mobileNumberLineNumber = "";
  public mobileNumber = "";

  // public ecMobileNumberAreaCode = "";
  // public ecMobileNumberPrefix = "";
  // public ecMobileNumberLineNumber = "";
  public ecMobileNumber = "";

  // public ecAltNumberAreaCode = "";
  // public ecAltNumberPrefix = "";
  // public ecAltNumberLineNumber = "";
  public ecAltNumber = "";

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
    let getMyProfileObservable =  this.userServices.getMyProfile();
    let getMyPreferencesObservable =  this.userServices.getMyPreferences();
    let getAvailablePreferencesObservable =  this.userServices.getAvailablePreferences();

    this.clearErrors();
    this.cleanBooleans();
    this.showLoading();

    // Get profile and preferences too
    Observable.forkJoin([getMyPreferencesObservable, getAvailablePreferencesObservable, getMyProfileObservable])
        .subscribe(data => {
          this.myPreferences = data[0];
          console.log(this.myPreferences);
          this.availablePreferences = data[1];

          const getProfileThenCheckRequiredFields = new Promise((resolve,reject) => {
          this.myProfile = data[2];
            resolve();
          });
          getProfileThenCheckRequiredFields.then((res) => {
            this.checkRequiredFields();
          });
          

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
			console.log("Onload myProfile " + JSON.stringify(this.myProfile));
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
    console.log("calling update profile");
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
    console.log(this.mobileNumber);
    this.translateFromFormPreferences();
    this.translateFromFormPhoneNumbers();
	console.log("myprofile" + JSON.stringify(this.myProfile));
	console.log("myprefs" + JSON.stringify(this.myPreferences));

    console.log(this.myProfile);

    this.checkRequiredFields();

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

  checkRequiredFields() {
    console.log(this.myProfile);
    this.requiredFieldError=false;
    if(this.myProfile.first_name===undefined) {
      this.requiredFieldError=true;
      console.log("first name: " + this.myProfile.first_name);
    }
    else if(this.myProfile.last_name===undefined) {
      this.requiredFieldError=true;
      console.log("last name: " + this.myProfile.last_name);
    }
    else if(this.myProfile.birthdate===undefined) {
      this.requiredFieldError=true;
      console.log("bday: " + this.myProfile.birthdate);
    }
    else if(this.myProfile.gender===undefined){
      this.requiredFieldError=true;
      console.log("gender: " + this.myProfile.gender);
    }
    else if(this.myProfile.emergency_contact.first_name===undefined) {
      this.requiredFieldError=true;
      console.log("ec first name: " + this.myProfile.emergency_contact.first_name);
    }
    else if(this.myProfile.emergency_contact.last_name===undefined) {
      this.requiredFieldError=true;
      console.log("ec last name: " + this.myProfile.emergency_contact.last_name);
    }
    else if(this.myProfile.emergency_contact.relation===undefined) {
      this.requiredFieldError=true;
      console.log("ec relation: " + this.myProfile.emergency_contact.relation);
    }
    else if(this.myProfile.emergency_contact.mobilenumber===undefined) {
      this.requiredFieldError=true;
      console.log("ec mobile number: " + this.myProfile.emergency_contact.mobilenumber);
    }
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

  isLocationInMyPreferences(id: number) {
    let locations = this.myPreferences.locations;
    for (let location of locations) {
      if (location.location_id == id) return true;
    }
    return false;
  }

  //TODO Once phone numbers are single values instead of three values, change this code
  translateToFormPhoneNumbers() {
    // Clear all parsed numbers
    // this.mobileNumberAreaCode = "";
    // this.mobileNumberPrefix = "";
    // this.mobileNumberLineNumber = "";
    this.mobileNumber = "";

    // this.mobileNumberAreaCode = "";
    // this.mobileNumberPrefix = "";
    // this.mobileNumberLineNumber = "";
    this.ecMobileNumber = "";

    // this.mobileNumberAreaCode = "";
    // this.mobileNumberPrefix = "";
    // this.mobileNumberLineNumber = "";
    this.ecAltNumber = "";

    // Parse profile mobile number
    // if (this.myProfile.mobilenumber && this.myProfile.mobilenumber.length == 11) {
    //   this.mobileNumberAreaCode = this.myProfile.mobilenumber.substring(1, 4);
    //   this.mobileNumberPrefix = this.myProfile.mobilenumber.substring(4, 7);
    //   this.mobileNumberLineNumber = this.myProfile.mobilenumber.substring(7, 11);
    // }
    if (this.myProfile.mobilenumber && this.myProfile.mobilenumber.length == 11) {
       this.mobileNumber = this.myProfile.mobilenumber;
       this.mobileNumber = "(" + this.myProfile.mobilenumber.substring(1,4) + ") " + this.myProfile.mobilenumber.substring(4, 7) + "-"  + this.myProfile.mobilenumber.substring(7, 11);
       //console.log("Mobile Number:" + this.mobileNumber);
    }

    // Parse emergency contact mobile number
    // if (this.myProfile.emergency_contact.mobilenumber && this.myProfile.emergency_contact.mobilenumber.length == 11) {
    //   this.ecMobileNumberAreaCode = this.myProfile.emergency_contact.mobilenumber.substring(1, 4);
    //   this.ecMobileNumberPrefix = this.myProfile.emergency_contact.mobilenumber.substring(4, 7);
    //   this.ecMobileNumberLineNumber = this.myProfile.emergency_contact.mobilenumber.substring(7, 11);
    // }
    if (this.myProfile.emergency_contact.mobilenumber && this.myProfile.emergency_contact.mobilenumber.length == 11) {
      this.ecMobileNumber = this.myProfile.emergency_contact.mobilenumber;
      this.ecMobileNumber = "(" + this.myProfile.emergency_contact.mobilenumber.substring(1, 4) + ") " + this.myProfile.emergency_contact.mobilenumber.substring(4, 7) + "-" + this.myProfile.emergency_contact.mobilenumber.substring(7, 11);
    }


    // Parse emergency contact alternate number
    // if (this.myProfile.emergency_contact.altnumber && this.myProfile.emergency_contact.altnumber.length == 11) {
    //   this.ecAltNumberAreaCode = this.myProfile.emergency_contact.altnumber.substring(1, 4);
    //   this.ecAltNumberPrefix = this.myProfile.emergency_contact.altnumber.substring(4, 7);
    //   this.ecAltNumberLineNumber = this.myProfile.emergency_contact.altnumber.substring(7, 11);
    // }
    if (this.myProfile.emergency_contact.altnumber && this.myProfile.emergency_contact.altnumber.length == 11) {
      this.ecAltNumber = this.myProfile.emergency_contact.altnumber;
      this.ecAltNumber = "(" + this.myProfile.emergency_contact.altnumber.substring(1, 4) + ") " + this.myProfile.emergency_contact.altnumber.substring(4, 7) + "-" + this.myProfile.emergency_contact.altnumber.substring(7, 11);
    }


  }

  translateFromFormPhoneNumbers() {
    // if (this.mobileNumberAreaCode || this.mobileNumberPrefix || this.mobileNumberLineNumber) {
    //   this.myProfile.mobilenumber = "1" + this.mobileNumberAreaCode + this.mobileNumberPrefix + this.mobileNumberLineNumber;
    // } else {
    //   this.myProfile.mobilenumber = "";
    // }
    if (this.preferredNumber.getPN()) {
      this.myProfile.mobilenumber = this.preferredNumber.getPN();
    }

    // if (this.ecMobileNumberAreaCode || this.ecMobileNumberPrefix || this.ecMobileNumberLineNumber) {
    //   this.myProfile.emergency_contact.mobilenumber = "1" + this.ecMobileNumberAreaCode + this.ecMobileNumberPrefix + this.ecMobileNumberLineNumber;
    // } else {
    //   this.myProfile.emergency_contact.mobilenumber = "";
    // }
    if (this.emergencyNumber.getPN()) {
      console.log("emergency number: " + this.emergencyNumber.getPN())
      this.myProfile.emergency_contact.mobilenumber = this.emergencyNumber.getPN();
    }

    // if (this.ecAltNumberAreaCode || this.ecAltNumberPrefix || this.ecAltNumberLineNumber) {
    //   this.myProfile.emergency_contact.altnumber = "1" + this.ecAltNumberAreaCode + this.ecAltNumberPrefix + this.ecAltNumberLineNumber;    
    // } else {
    //   this.myProfile.emergency_contact.altnumber = "";
    // }
    if (this.emergencyAlternate.getPN()) {
      this.myProfile.emergency_contact.altnumber = this.emergencyAlternate.getPN();
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

    this.formLocations = [];

    // Add all available preferences, and for those in "myPreferences.serviceareas", set the selected value to true
    let locations = this.availablePreferences.locations;
    for (let location of locations) {
      let selected = this.isLocationInMyPreferences(location.id) ? true : false;
      location.selected = selected; 
      this.formLocations.push(location);
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
    
    // Start with empty locations list in myPreferences
    this.myPreferences.locations = [];

    // For every item on the form that is selected, add it to myPreferences
    let formLocations = this.formLocations;
    for (let location of formLocations) {
      if (location.selected) {
        let newLocation = {
          location_id: location.id
        };
        this.myPreferences.locations.push(newLocation); 
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

        this.firstnameerrorvalue = "";
        this.lastnameerrorvalue = "";
        this.birthdateerrorvalue = "";
        this.my_contactmethod_iderrorvalue = "";
        this.my_volunteertype_iderrorvalue = "";
        this.acceptedwaivererrorvalue = "";
        this.acceptedpolicyerrorvalue = "";
        this.com_opt_inerrorvalue = "";
  
        this.mobilenumbererrorvalue = "";
        this.emailerrorvalue = "";
        this.parent_consenterrorvalue = "";

        this.gendererrorvalue = "";
        this.address1errorvalue = "";
        this.address2errorvalue = "";
        this.cityerrorvalue = "";
        this.stateerrorvalue = "";
        this.zipcodeerrorvalue = "";
        this.my_servicearea_iderrorvalue = "";
        this.my_referalsource_iderrorvalue = "";
        this.my_donationtype_iderrorvalue = "";

        this.ecfirstnameerrorvalue = "";
        this.eclastnameerrorvalue = "";
        this.ecrelationerrorvalue = "";
        this.ecmobilenumbererrorvalue = "";
        this.ecaltnumbererrorvalue = "";

        this.passworderrorvalue = "";
        this.password1errorvalue = "";
        this.password2errorvalue = "";

        //Lets close all accordionboxes
        this.accordionMyCredentials.expand(false);
        this.accordionPreferredContact.expand(false);
        this.accordionEmergencyContact.expand(false);
        this.accordionVolunteerTypes.expand(false);
        this.accordionPreferredLocations.expand(false);
        this.accordionServiceAreas.expand(false);
        this.accordionChangePassword.expand(false);

  }
  
  setError(error) {
    if (error.status === 400) {
      error = error.json();
      console.log(error);
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
          var message = error[key][val].toString();
//          this[key + "error"] = true;
          if (key==='first_name') {
            this.firstnameerror=true;
            this.firstnameerrorvalue=message;
          }
          if (key==='last_name') {
            this.lastnameerror=true;
            this.lastnameerrorvalue=message;
          }
          if (key==='birthdate') {
            this.birthdateerror=true;
            this.birthdateerrorvalue=message;
          }
          if (key==='my_contactmethod_id') {
            this.my_contactmethod_iderror=true;
            this.my_contactmethod_iderrorvalue=message;
          }
          if (key==='my_volunteertype_id') {
            this.my_volunteertype_iderror=true;
            this.my_volunteertype_iderrorvalue=message;
          }
          if (key==='acceptedwaiver') {
            this.acceptedwaivererror=true;
            this.acceptedwaivererrorvalue=message;
          }
          if (key==='acceptedpolicy') {
            this.acceptedpolicyerror=true;
            this.acceptedpolicyerrorvalue=message;
          }
          if (key==='com_opt_in') {
            this.com_opt_inerror=true;
            this.com_opt_inerrorvalue=message;
          }

          if (key==='mobilenumber') {
            this.mobilenumbererror=true;
            this.mobilenumbererror=message;
          }
          if (key==='email') {
            this.emailerror=true;
            this.emailerrorvalue=message;
          }
          if (key==='parent_consent') {
            this.parent_consenterror=true;
            this.parent_consenterrorvalue=message;
          }

          if (key==='gender') {
            this.gendererror=true;
            this.gendererrorvalue=message;
          }
          if (key==='address1') {
            this.address1error=true;
            this.address1errorvalue=message;
          }
          if (key==='address2') {
            this.address2error=true;
            this.address2errorvalue=message;;
          }
          if (key==='city') {
            this.cityerror=true;
            this.cityerrorvalue=message;
          }
          if (key==='state') {
            this.stateerror=true;
            this.stateerrorvalue
          }
          if (key==='zipcode') {
            this.zipcodeerror=true;
            this.zipcodeerrorvalue=message;
          }
          if (key==='my_servicearea_id') {
            this.my_servicearea_iderror=true;
            this.my_servicearea_iderrorvalue=message;
          }
          if (key==='my_referalsource_id') {
            this.my_referalsource_iderror=true;
            this.my_referalsource_iderrorvalue=message;}
          if (key==='my_donationtype_id') {
            this.my_donationtype_iderror=true;
            this.my_donationtype_iderrorvalue=message;
          }

          if (key==='old_password') {
            this.passworderror=true;
            this.passworderrorvalue=message;
          }
          if (key==='new_password1') {
            this.password1error=true;
            this.password1errorvalue=message;
          }
          if (key==='new_password2') {
            this.password2error=true;
            this.password2errorvalue=message;
          }

          if (key==='contact')  {
            let object = error[key];
            if (object.mobilenumber) {
              this.mobilenumbererror=true;
              this.mobilenumbererrorvalue=message;
            }
            if (object.email) {
              this.emailerror=true;
              this.emailerrorvalue=message;
            }
          }
          if (key==='emergency_contact')  {
            let object = error[key];
            if (object.mobilenumber) {
              this.ecmobilenumbererror=true;
              this.ecmobilenumbererrorvalue=message;
            }
            if (object.altnumber) {
              this.ecaltnumbererror=true;
              this.ecaltnumbererrorvalue=message;
            }
          }
          if (key==='emergency_contact_first_name') {
            this.ecfirstnameerror=true;
            this.ecfirstnameerrorvalue=message;
          }
          if (key==='emergency_contact_last_name') {
            this.eclastnameerror=true;
            this.eclastnameerrorvalue=message;
          }
          if (key==='emergency_contact_relation') {
            this.ecrelationerror=true;
            this.ecrelationerrorvalue=message;
          }
        }
      }
      this.content.scrollToTop();
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
      this.content.scrollToTop();
    }

      //       @ViewChild('accordionMyCredentials') accordionMyCredentials : AccordionBox;
  // @ViewChild('accordionPreferredContact') accordionPreferredContact : AccordionBox;
  // @ViewChild('accordionEmergencyContact') accordionEmergencyContact : AccordionBox;
  // @ViewChild('accordionVolunteerTypes') accordionVolunteerTypes : AccordionBox;
  // @ViewChild('accordionPreferredLocations') accordionPreferredLocations : AccordionBox;
  // @ViewChild('accordionServiceAreas') accordionServiceAreas : AccordionBox;
  // @ViewChild('accordionChangePassword') accordionChangePassword : AccordionBox;

    //Now, if therre are any error messages in an accordionbox, lets expand it!
    this.accordionMyCredentials.expand(this.firstnameerror || this.lastnameerror || this.birthdateerror || this.gendererror
      || this.address1error || this.address2error || this.cityerror || this.stateerror || this.zipcodeerror);

    this.accordionPreferredContact.expand(this.my_contactmethod_iderror || this.mobilenumbererror || this.emailerror);

    this.accordionEmergencyContact.expand(this.ecfirstnameerror || this.eclastnameerror || this.ecrelationerror 
      || this.ecmobilenumbererror || this.ecaltnumbererror );

    this.accordionVolunteerTypes.expand(this.my_volunteertype_iderror || this.my_referalsource_iderror);

    //There are not (yet?) any errors for this accordionbox
    // this.accordionPreferredLocations.expand(true);
    //this.accordionServiceAreas.expand(true);

    this.accordionChangePassword.expand(this.passworderror || this.password1error || this.password2error);
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
