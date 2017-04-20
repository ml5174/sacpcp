import { Component, ViewChild } from '@angular/core'
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  template: `
<ion-header>
    <app-header title="Recovery Method Sent">
    </app-header>
</ion-header>
<ion-content>
    <section id="tab-content" padding>
    We've sent out your password recovery through your selected method. Please try again in an hour and make sure the information is entered in correctly.
    </section>
</ion-content>
<ion-footer class="action-footer">
    <ion-grid>
        <ion-row>
            <ion-col>
                <button ion-button color="primary" (click)="home()">Home</button>
            </ion-col>
        </ion-row>
    </ion-grid>
</ion-footer>
`
})
export class RecoverSuccessPage {
  constructor(private nav: NavController) {}

  home() {
    this.nav.push(HomePage);
  }
}
