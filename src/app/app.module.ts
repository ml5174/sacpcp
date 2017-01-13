import { EventDetailModal } from './../pages/events/eventdetail-modal';
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
import { EventPage } from '../pages/events/events';
import { MyEventsPage } from '../pages/myevents/myevents';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { AppHeaderComponent } from '../components/app-header.component';
import { HomeTab } from '../components/home-tab';
import { Storage } from '@ionic/storage';

import { UseridPopover } from '../popover/userid';
import { PasswordPopover } from '../popover/password';

import { UserServices } from '../service/user';
import { VolunteerEventsService } from '../service/volunteer-events-service';

import { ReferralSourcePipe } from '../pipe/referralsource.pipe';
import { MomentTimeZonePipe } from '../pipe/moment-timezone.pipe';
import { TimeFromNowPipe } from '../pipe/timefromnow.pipe';
import { ContactMethod } from '../components/ContactMethod/contactMethod.component';

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: ChangePasswordPage, name: 'Change Password Page', segment: 'password-reset/confirm/:iud/:key' },
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
    EventPage,
    MyEventsPage,
    AppHeaderComponent,
    HomeTab,
    RegisterLoginPage,
    RegisterIndividualProfilePage,
    UseridPopover,
    PasswordPopover,
    ReferralSourcePipe,
    MomentTimeZonePipe,
    TimeFromNowPipe,
    EventDetailModal,
    ContactMethod
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }, deepLinkConfig),
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
    RegisterIndividualProfilePage,
    EventDetailModal
  ],
  providers: [Storage, UseridPopover, PasswordPopover, UserServices, VolunteerEventsService]
})
export class AppModule {}
