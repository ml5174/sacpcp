import {Component} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import {TranslateService} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'register-individual-profile.html'
})
export class RegisterIndividualProfilePage {
  private username: string = '';
  private password1: string = '';
  private password2: string = '';
  private email: string = '';
  private key: string = '';
  private val: string = '';
  private errors: Array<string> = [];

  private mobilenumbererror: boolean = false;
  private altnumbererror: boolean = false;
  private address1error: boolean = false;
  private address2error: boolean = false;
  private cityerror: boolean = false;
  private stateerror: boolean = false;
  private zipcodeerror:  boolean = false;
  private birthdateerror:  boolean = false;
  private languageerror:  boolean = false;
  private notification_optionerror:  boolean = false;
  private contactmethoderror:  boolean = false;
  private my_contactmethod_iderror:  boolean = false;
  private volunteertypeerror:  boolean = false;
  private my_volunteertype_iderror:  boolean = false;
  private serviceareaerror:  boolean = false;
  private my_servicearea_iderror:  boolean = false;
  private referalsourceerror:  boolean = false;
  private my_referalsource_iderror:  boolean = false;
  private donationtypeerror:  boolean = false;
  private my_donationtype_iderror:  boolean = false;

  private myProfile: any = {};
  private availablePreferences: Array<any> = [];
  private myPreferences: Array<any>;

  private mobileNumber: string;
  private altNumber: string;
  private address1: string;
  private address2: string;
  private city: string;
  private state: string;
  private zipCode: string;
  private birthDate: Date;
  private mugShot: string;
  private language: string;
  private notificationOption: string;
  private contactMethod: string;
  private myContactMethodId: string;
  private volunteerType: string;
  private myVolunteerTypeId: string;
  private serviceArea: string;
  private myServiceAreaId: string;
  private referralSource: string;
  private myReferralSourceId: string;
  private donationType: string;
  private myDonationTypeId: string;

  private profileExists: boolean = false;

  constructor(private nav: NavController,
              private userServices: UserServices,
              private translate: TranslateService) {

  }

  // On initialization, get the latest info from the server
  ngOnInit() {
    let getMyProfileObservable =  this.userServices.getMyProfile()
    let getMyPreferencesObservable =  this.userServices.getMyPreferences()
    let getAvailablePreferencesObservable =  this.userServices.getAvailablePreferences()

    // Get my profile if it exists
    getMyProfileObservable.subscribe(
      data => {
        console.log(data);
        this.myProfile = data;
        this.profileExists = true;
      }, 
      err => {
        if (err.status == "404") {
          console.log("Profile not yet created");
          this.profileExists = false;
        } else {
          console.log(err);
        }
      });

    // Get preferences too
    Observable.forkJoin([getMyPreferencesObservable, getAvailablePreferencesObservable])
        .subscribe(data => {
            this.myPreferences = data[0];
            this.availablePreferences = data[1];

            console.log(this.myPreferences);
            console.log(this.availablePreferences);
        }, err => {
          console.log(err);
        });

  }

  register() {

    if (this.profileExists) {
      this.updateProfile();
    } else {
      this.createProfile();
    }
  }

  createProfile() {
    this.errors = [];
    this.userServices.createMyProfile(this.myProfile)
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
  }

  updateProfile() {
    this.clearErrors();
    this.userServices.updateMyProfile(this.myProfile)
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
  }

  clearErrors() {
        this.errors = [];

        this.mobilenumbererror=false;
        this.altnumbererror=false;
        this.address1error=false;
        this.address2error=false;
        this.cityerror=false;
        this.stateerror=false;
        this.zipcodeerror=false;
        this.birthdateerror=false;
        this.languageerror=false;
        this.notification_optionerror=false;
        this.volunteertypeerror=false;
        this.my_volunteertype_iderror=false;
        this.serviceareaerror=false;
        this.my_servicearea_iderror=false;
        this.my_referalsource_iderror=false;
        this.donationtypeerror=false;
        this.my_donationtype_iderror=false;

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
          if (key==='mobilenumber') this.mobilenumbererror=true;
          if (key==='altnumber') this.altnumbererror=true;
          if (key==='address1') this.address1error=true;
          if (key==='address2') this.address2error=true;
          if (key==='city') this.cityerror=true;
          if (key==='state') this.stateerror=true;
          if (key==='zipcode') this.zipcodeerror=true;
          if (key==='birthdate') this.birthdateerror=true;
          if (key==='language') this.languageerror=true;
          if (key==='notification_option') this.notification_optionerror=true;
          if (key==='volunteertype') this.volunteertypeerror=true;
          if (key==='my_volunteertype_id') this.my_volunteertype_iderror=true;
          if (key==='servicearea') this.serviceareaerror=true;
          if (key==='my_servicearea_id') this.my_servicearea_iderror=true;
          if (key==='my_referalsource_id') this.my_referalsource_iderror=true;
          if (key==='donationtype') this.donationtypeerror=true;
          if (key==='my_donationtype_id') this.my_donationtype_iderror=true;
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }

}
