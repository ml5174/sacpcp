import {Component} from '@angular/core'
import {UserServices} from '../../service/user';
import {NavController, Nav} from 'ionic-angular';
import {STRINGS} from '../../provider/config'
import { RegisterIndividualProfilePage } from '../register-individual-profile/register-individual-profile';
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'build/pages/confirm-sms/confirm-sms.html',
  pipes: [TranslatePipe]
})
export class ConfirmSMSPage {
  private code: string = '';
  private codeerror: boolean = false;
  constructor(private nav: NavController,
              private userServices: UserServices) {

  }
  validateCode() {
    this.nav.push(RegisterIndividualProfilePage);
  }
}
