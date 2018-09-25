import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgramsPage } from './programs';

@NgModule({
  declarations: [
    ProgramsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgramsPage),
  ],
})
export class ProgramsPageModule {}
