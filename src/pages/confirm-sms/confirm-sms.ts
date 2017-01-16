import {Component} from '@angular/core'
import {UserServices} from '../../lib/service/user';
import {NavController} from 'ionic-angular';
import {STRINGS} from '../../lib/provider/config'
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import {TranslateService} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'confirm-sms.html'
})
export class ConfirmSMSPage {
  private code: string = '';
  private codeerror: boolean = false;
  constructor(private nav: NavController,
              private userServices: UserServices,
              private translate: TranslateService) {

  }
  validateCode() {
    this.nav.push(RegisterIndividualProfilePage);
  }
}
