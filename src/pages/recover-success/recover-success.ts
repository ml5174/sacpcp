import { Component } from '@angular/core'
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
        <p>You should receive an email/text shortly to complete your user ID/password reset</p>
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
