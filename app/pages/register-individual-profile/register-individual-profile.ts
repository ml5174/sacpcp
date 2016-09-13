import {Component} from '@angular/core'
import {Observable} from 'rxjs/Rx';
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config';
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'build/pages/register-individual-profile/register-individual-profile.html',
  pipes: [TranslatePipe]
})
export class RegisterIndividualProfilePage {
  username: string = '';
  password1: string = '';
  password2: string = '';
  email: string = '';
  key: string = '';
  val: string = '';
  errors: Array<string> = [];

  myProfile: any = {};
  availablePreferences: Array<any> = [];
  myPreferences: Array<any>;

  mobileNumber: string;
  altNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  birthDate: Date;
  mugShot: string;
  language: string;
  notificationOption: string;
  contactMethod: string;
  myContactMethodId: string;
  volunteerType: string;
  myVolunteerTypeId: string;
  serviceArea: string;
  myServiceAreaId: string;
  referralSource: string;
  myReferralSourceId: string;
  donationType: string;
  myDonationTypeId: string;

  constructor(private nav: NavController,
              private userServices: UserServices) {

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
      }, 
      err => {
        if (err.status == "404") {
          console.log("Profile not yet created");
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
    this.errors = [];
    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: this.email
    }
    this.userServices.registerUser(register)
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
          
  }
  setError(error) {
    if (error.status === 400) {
      error = error.json();
      for (let key in error) {
        for (let val in error[key]) {
          let field = '';
          if (STRINGS[key]) field = STRINGS[key] + ': ';
          this.errors.push(field + error[key][val].toString());
        }
      }
    }
    if (error.status === 500) {
      this.errors.push('Backend returned 500 error, talk to JOHN :) ');
    }

  }

}
