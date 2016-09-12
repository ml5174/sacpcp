import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config'

@Component({
  templateUrl: 'build/pages/register-individual-profile/register-individual-profile.html'
})
export class RegisterIndividualProfilePage {
  username: string = '';
  password1: string = '';
  password2: string = '';
  email: string = '';
  key: string = '';
  val: string = '';
  errors: Array<string> = [];

  constructor(private nav: NavController,
              private userServices: UserServices) {

    this.getMyPreferences();
    this.getAvailablePreferences();

  }

  getMyPreferences() {
    this.userServices.getMyPreferences()
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          })
  }
  getAvailablePreferences() {
    this.userServices.getAvailablePreferences()
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          })
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
