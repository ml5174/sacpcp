import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
 
 
 
@Injectable()
export class UserData {
   
 
  constructor(
      public storage: Storage,
      
      ) {}
 
 
  setContact(contact) {
    this.storage.set('contact', JSON.stringify(contact));
  }
 
  getContact() {
    return this.storage.get('contact').then((value) => {
      return value;
    });
  }
 
}