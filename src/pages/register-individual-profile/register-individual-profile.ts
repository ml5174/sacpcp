import {Component} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import {TranslateService} from "ng2-translate/ng2-translate";
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'register-individual-profile.html'
})
export class RegisterIndividualProfilePage {
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

  // Other private variables
  private myProfile: any = {};
  private availablePreferences: Array<any> = [];
  private myPreferences: Array<any>;

  private profileExists: boolean = false;

  // Constructor
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
        console.log('myprofile:'+this.userServices.user.profile);
        if (this.userServices.user.profile) {
          this.profileExists = true;
          this.myProfile = this.userServices.user.profile;
          if (this.myProfile.tc_version == "") this.myProfile.tc_version = null;
        }
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
    this.cleanBooleans();
    this.myProfile.emergency_contact = {};
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
    this.cleanBooleans();
    this.myProfile.emergency_contact = {};
    this.userServices.updateMyProfile(this.myProfile)
      .subscribe(
          key => this.key = key, 
          err => { 
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
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }

  back() {
    this.nav.setRoot(HomePage);
  }
}
