import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyhomePage } from './myhome';
import {EventPage} from '../events/events';
import {MyEventsPage} from '../myevents/myevents';

@NgModule({
  declarations: [
    MyhomePage,
  ],
  imports: [
    IonicPageModule.forChild(MyhomePage),
  ],
  providers: [EventPage, MyEventsPage]
})
export class MyhomePageModule {}
