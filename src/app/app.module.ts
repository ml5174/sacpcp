import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';
import { EventDetailModal } from './../pages/events/eventdetail-modal';
import { EventDetailPopup } from './../pages/events/eventdetail-popup';
import { EventSignupModal } from './../pages/events/eventsignup_modal';
import { AddAttendeesModal } from './../pages/events/add-attendees/add-attendees-modal';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig  } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { AppInfoPage } from '../pages/app-info/app-info';
import { ContactPage } from '../pages/contact/contact';
import { EventPage } from '../pages/events/events';
import { MyEventsPage } from '../pages/myevents/myevents';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { MyGroupsPage } from '../pages/mygroups/mygroups';
import { CreateEvent } from '../pages/admin/create-event/create-event';
import { EditEvent } from '../pages/admin/edit-event/edit-event';
import { Reports } from '../pages/admin/reports/reports';
import { ContactVolunteers } from '../pages/admin/contact-volunteers/contact-volunteers';
import { Groups } from '../pages/admin/groups/groups';
import { Message } from '../pages/admin/contact-volunteers/message'
import { Admin } from '../pages/admin/admin';
import { AppHeaderComponent } from '../lib/components/app-header.component';
import { HomeTab } from '../lib/components/home-tab';
import { PhoneInput } from '../lib/components/phone-input.component';
import { AccordionBox } from '../lib/components/accordion-box';
import { PrivacyTermsContent } from '../lib/components/privacy-terms-content';
import { IonicStorageModule } from '@ionic/storage';
import { UseridPopover } from '../popover/userid';
import { PasswordPopover } from '../popover/password';
import { EventSortPopover } from '../popover/eventsort-popover';
import { PreferredSearchPopover } from '../popover/preferredsearch-popover';
import { ParentVerifyModal } from '../modals/parent-verify-modal';
import { PrivacyTermsModal } from '../modals/privacy-terms-modal';
import { UserServices } from '../lib/service/user';
import { SignupAssistant } from '../lib/service/signupassistant';
import { VolunteerEventsService } from '../lib/service/volunteer-events-service';
import { ReferralSourcePipe } from '../lib/pipe/referralsource.pipe';
import { MomentTimeZonePipe } from '../lib/pipe/moment-timezone.pipe';
import { TimeFromNowPipe } from '../lib/pipe/timefromnow.pipe';
import { ValidationErrorPipe } from '../lib/pipe/validationerror.pipe';
import { EventSortPipe, PreferencePipe, OpportunityPipe } from '../lib/pipe/eventsortpipe';
import { ParseTimePipe } from '../lib/pipe/moment.pipe';
import { ContactMethod } from '../lib/components/ContactMethod/contactMethod.component';
import { ErrorMessageSpan} from '../lib/components/error-message-span/error-message-span';
import { RecoverSuccessPage } from '../pages/recover-success/recover-success';
//Added for text-mask, phone number formatting
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MessageServices } from '../lib/service/message';
import { DatePickerCalendar } from '../lib/components/date-picker-calendar/date-picker-calendar.component';
import { DatePicker } from '../lib/components/date-picker/date-picker.component';
import { MemberDataEntry } from '../lib/components/member-data-entry/member-data-entry';
import { CreateGroupPage } from '../pages/create-group/create-group';
import { GroupProfilePage } from '../pages/group-profile/group-profile';
import { EditGroupAttendancePage } from '../pages/edit-group-attendance/edit-group-attendance';
import { GroupAttendeeModal } from '../modals/group-attendee-modal';
import { MemberPopOver } from '../pages/group-profile/member-popover';
import { AppVersion } from '@ionic-native/app-version';
import { AppPreferences } from '@ionic-native/app-preferences';
import { MessageTargetList } from '../lib/components/message-target-list/message-target-list';
import { OrganizationServices } from '../lib/service/organization';
import { GroupAction } from '../modals/group-action/group-action';

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: ChangePasswordPage, name: 'Change Password Page', segment: 'password-reset/confirm/:iud/:key' },
  ]
};

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n', '.json');
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
    AppInfoPage,
    ContactPage,
    CreateGroupPage,
    GroupProfilePage,
    EventPage,
    MyEventsPage,
    AppHeaderComponent,
    HomeTab,
    RegisterLoginPage,
    RegisterIndividualProfilePage,
    MyGroupsPage,
    EditGroupAttendancePage,
    UseridPopover,
    PasswordPopover,
    EventSortPopover,
    PreferredSearchPopover,
    ParentVerifyModal,
    PrivacyTermsModal,
    ReferralSourcePipe,
    MomentTimeZonePipe,
    TimeFromNowPipe,
    ValidationErrorPipe,
    ParseTimePipe,
    EventSortPipe,
    PreferencePipe,
    OpportunityPipe,
    EventDetailModal,
    EventDetailPopup,
    ContactMethod,
    PhoneInput,
    Admin,
    CreateEvent,
    EditEvent,
    MessageTargetList,
    Reports,
    ContactVolunteers,
    Groups,
    Message,
    AccordionBox,
    PrivacyTermsContent,
    RecoverSuccessPage,
    DatePickerCalendar,
    DatePicker,
    EventSignupModal,
    AddAttendeesModal,
    GroupAttendeeModal,
    MemberDataEntry,
    MemberPopOver,
    ErrorMessageSpan,
    GroupAction
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, deepLinkConfig),
    TranslateModule.forRoot({ 
          loader: {
	          provide: TranslateLoader,
       		  useFactory: translateFactory,
          	  deps: [HttpClient]
          }
        }),
    //Added for text-mask, for phone number formatting
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule
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
    ParentVerifyModal,
    PrivacyTermsModal,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    AboutPage,
    AppInfoPage,
    ContactPage,
    RegisterLoginPage,
    RegisterIndividualProfilePage,
    MyGroupsPage,
    CreateGroupPage,
    GroupProfilePage,
    EditGroupAttendancePage,
    EventDetailModal,
    Admin,
    CreateEvent,
    EditEvent,
    Reports,
    ContactVolunteers,
    Groups,
    Message,
    EventDetailPopup,
    RecoverSuccessPage,
    DatePickerCalendar,
    DatePicker,
    EventSignupModal,
    AddAttendeesModal,
    GroupAttendeeModal,
    MemberPopOver,
    GroupAction
    
  ],
  providers: [ 
    AppVersion,
    StatusBar, 
    SplashScreen, 
    UseridPopover, 
    PasswordPopover, 
    UserServices, 
    VolunteerEventsService, 
    SignupAssistant, 
    MessageServices,
    OrganizationServices
  ]
})
export class AppModule {}
