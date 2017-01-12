import { EventImage } from './eventImage';

export class EventDetail {
  age_restriction: string;
  category_id: string = "";
  categoryimages: string[];
  contacts: string[];
  description: string = "";
  end: Date = new Date();
  eventimages: string[];
  gender_restriction: string;
  id: string;
  location_address1: string;
  location_address2: string;
  location_city : string;
  location_id: string;
  location_name: string = "";
  location_state : string;
  location_zipcode: string;
  max_volunteers: string;
  min_volunteers: string;
  notification_option: string;
  notification_schedule: string;
  same_day_registration: string;
  skills: string[];
  start: Date = new Date();
  status: string;
  title: string = "";
  type: string;
  typename: string;
  visibility: string;
  volunteer_restriction: string;
  volunteercount: string;

  //volunteers array only shows up if admin call is made
  volunteers: string[];

  
  image: Array<EventImage> = [new EventImage()];

}
