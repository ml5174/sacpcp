import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGroupPage } from './create-group';
import { AutocompleteModule } from '@brycemarshall/autocomplete-ionic';


@NgModule({
  declarations: [
    CreateGroupPage,
  ],
  imports: [
    AutocompleteModule,
    IonicPageModule.forChild(CreateGroupPage),
  ],
})
export class CreateGroupPageModule {}
