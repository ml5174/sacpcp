import {Component} from '@angular/core'
import {UserServices} from '../../lib/service/user';
import {NavController} from 'ionic-angular';
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import {TranslateService} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'confirm-sms.html'
})
export class ConfirmSMSPage {
  public code: string = '';
  public codeerror: boolean = false;
  public errors = [];
  constructor(public nav: NavController,
              public userServices: UserServices,
              public translate: TranslateService) {

  }
  validateCode() {
    this.nav.push(RegisterIndividualProfilePage);
  }
}
