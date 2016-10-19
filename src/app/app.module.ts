import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { MyApp } from './app.component';
import { TermsPage } from '../pages/terms/terms';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { DonatePage } from '../pages/donate/donate';
import { ForgotPage } from '../pages/forgot/forgot';
import { LoginPage } from '../pages/login/login';
import { RegisterLoginPage } from '../pages/register-login/register-login';
import { RegisterIndividualProfilePage } from '../pages/register-individual-profile/register-individual-profile';
import { AppHeaderComponent } from '../components/app-header.component';
import { Storage } from '@ionic/storage';

import { UserServices } from '../service/user';

@NgModule({
  declarations: [
    MyApp,
    TermsPage,
    ItemDetailsPage,
    ListPage,
    TabsPage,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    AppHeaderComponent,
    RegisterLoginPage,
    RegisterIndividualProfilePage
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp),
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
    ItemDetailsPage,
    ListPage,
    TabsPage,
    HomePage,
    DonatePage,
    ForgotPage,
    LoginPage,
    RegisterLoginPage,
    RegisterIndividualProfilePage
  ],
  providers: [Storage]
})
export class AppModule {}
