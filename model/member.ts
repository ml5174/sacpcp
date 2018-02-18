import { Contact } from '../model/contact'
export class Member extends Contact {
    isAttending: boolean;
    contactMethod? : number = 0;  //this should be an enum 0none, 1mobile, 2email 
}