import { Component, Input } from '@angular/core';
import { UserServices } from '../service/user';
import { Nav } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { UserProfile } from '../model/user-profile';
import { VolunteerEventsService } from '../service/volunteer-events-service';
import { HomePage } from '../pages/home/home';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html'
})

export class AppHeaderComponent {
  @Input('back') isBack: boolean = false;
  @Input('title') title: string = 'Login'

  rootPage: any = HomePage;

  constructor(
    private nav: Nav,
    private userServices: UserServices,
    private volunteerEvents : VolunteerEventsService
  ) {
  }
  login() {
    this.nav.push(LoginPage);
  }
  logout() {
    this.userServices.logout();
    this.volunteerEvents.clearEvents();
    this.nav.setRoot(HomePage);
  }
  
  donate(){
  	 window.open('http://www.salvationarmydfw.org/p/get-involved/437', '_blank');
  }
  
  profile() {
    this.nav.push(RegisterIndividualProfilePage);
  }
  back() {
    this.nav.pop();
  }
}