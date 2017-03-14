import { EventDetailModal } from './../pages/events/eventdetail-modal';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig  } from 'ionic-angular';

import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { MyApp } from './app.component';
import { TermsPage } from '../pages/terms/terms';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ConfirmEmailPage } from '../pages/confirm-email/confirm-email';
import { ConfirmSMSPage } from '../pages/confirm-sms/confirm-sms';
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
import { AppHeaderComponent } from '../lib/components/app-header.component';
import { HomeTab } from '../lib/components/home-tab';
import { PhoneInput } from '../lib/components/phone-input.component';
import { Storage } from '@ionic/storage';

import { UseridPopover } from '../popover/userid';
import { PasswordPopover } from '../popover/password';
import { EventSortPopover } from '../popover/eventsort-popover';
import { PreferredSearchPopover } from '../popover/preferredsearch-popover';

import { UserServices } from '../lib/service/user';
import { VolunteerEventsService } from '../lib/service/volunteer-events-service';

import { ReferralSourcePipe } from '../lib/pipe/referralsource.pipe';
import { MomentTimeZonePipe } from '../lib/pipe/moment-timezone.pipe';
import { TimeFromNowPipe } from '../lib/pipe/timefromnow.pipe';
import { EventSortPipe } from '../lib/pipe/eventsortpipe';
import { ParseTimePipe } from '../lib/pipe/moment.pipe';
import { ContactMethod } from '../lib/components/ContactMethod/contactMethod.component';
import { EditEventDetailPage } from '../pages/admin/editEventDetail';
export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: ChangePasswordPage, name: 'Change Password Page', segment: 'password-reset/confirm/:iud/:key' },
  ]
};

export function translateFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TermsPage,
    ConfirmEmailPage,
    ConfirmSMSPage,
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
    EventSortPopover,
    PreferredSearchPopover,
    ReferralSourcePipe,
    MomentTimeZonePipe,
    TimeFromNowPipe,
    ParseTimePipe,
    EventSortPipe,
    EventDetailModal,
    ContactMethod,
    PhoneInput,
    EditEventDetailPage
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp, {}, deepLinkConfig),
    TranslateModule.forRoot({ 
          provide: TranslateLoader,
          useFactory: translateFactory,
          deps: [Http]
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TermsPage,
    ConfirmEmailPage,
    ConfirmSMSPage,
    ChangePasswordPage,
    UseridPopover,
    PasswordPopover,
    EventSortPopover,
    PreferredSearchPopover,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    AboutPage,
    ContactPage,
    RegisterLoginPage,
    RegisterIndividualProfilePage,
    EventDetailModal,
    EditEventDetailPage
  ],
  providers: [Storage, UseridPopover, PasswordPopover, UserServices, VolunteerEventsService]
})
export class AppModule {}
