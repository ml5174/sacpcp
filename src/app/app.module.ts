import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig  } from 'ionic-angular';

import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { MyApp } from './app.component';
import { TermsPage } from '../pages/terms/terms';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ConfirmEmailPage } from '../pages/confirm-email/confirm-email';
import { HomePage } from '../pages/home/home';
import { DonatePage } from '../pages/donate/donate';
import { ForgotPage } from '../pages/forgot/forgot';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { AppHeaderComponent } from '../components/app-header.component';
import { Storage } from '@ionic/storage';

import { UseridPopover } from '../popover/userid';
import { PasswordPopover } from '../popover/password';

import { UserServices } from '../service/user';

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: ChangePasswordPage, name: 'Change Passowrd Page', segment: 'password-reset/confirm/:iud/:key' },
  ]
};

@NgModule({
  declarations: [
    MyApp,
    TermsPage,
    ConfirmEmailPage,
    ChangePasswordPage,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    AboutPage,
    ContactPage,
    AppHeaderComponent,
    RegisterLoginPage,
    RegisterIndividualProfilePage,
    UseridPopover,
    PasswordPopover
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {}, deepLinkConfig),
    TranslateModule.forRoot({ 
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
          deps: [Http]
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TermsPage,
    ConfirmEmailPage,
    ChangePasswordPage,
    UseridPopover,
    PasswordPopover,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    AboutPage,
    ContactPage,
    RegisterLoginPage,
    RegisterIndividualProfilePage
  ],
  providers: [Storage, UseridPopover, PasswordPopover]
})
export class AppModule {}
