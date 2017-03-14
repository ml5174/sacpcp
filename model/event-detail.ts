import { EventImage } from './eventImage';

export class EventDetail {
  age_restriction: string;
  category_id: string = "";
  categoryimages: string[];
  contacts: string[];
  count: string;
  created_by: string;
  creation_date: string;
  description: string = "";
  end: Date = new Date();
  end_recurring_period: string;
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
  occ_parent: string;
  occ_status: string;
  rule: string;
  same_day_registration: string;
  serviceareas: string[];
  skills: string[];
  special_instructions: string;
  start: Date = new Date();
  status: string;
  status_notes: string;
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
