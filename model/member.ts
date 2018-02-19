import { Contact } from '../model/contact'
export class Member extends Contact {
    isAttending: boolean;
    isTypeAttendee: boolean = false; // used to differentiate between normal group members and attendee for event editing purposes
    contactMethod? : number = 0;  // TODO: this should be an enum 0=none, 1=mobile, 2=email (for now, hard coded)
}