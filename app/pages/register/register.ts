import {Component} from '@angular/core'
import {LoginServices} from '../../service/login';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config'

@Component({
  templateUrl: 'build/pages/register/register.html',
  providers: [LoginServices]
})
export class RegisterPage {
  username: string = '';
  password1: string = '';
  password2: string = '';
  email: string = '';
  key: string = '';
  val: string = '';
  errors: Array<string> = [];

  constructor(private nav: NavController,
              private loginServices: LoginServices) {

  }

  register() {
    this.errors = [];
    let register = {
      username: this.username,
      password1: this.password1,
      password2: this.password2,
      email: this.email
    }
    this.loginServices.register(register)
      .subscribe(
          key => this.key = key, 
          err => { 
            console.log(err);
            this.setError(err);
          }),
          val => this.val = val;
          
  }
  setError(error) {
    for (let key in error) { 
      for (let val in error[key]) {
        this.errors.push(STRINGS[key]+': '+error[key][val].toString());
      }
    }
  }
}
