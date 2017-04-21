export class VolunteerEvent {
  id: string;
  start: Date = new Date();
  end: Date = new Date();
  title: string = "";
  description: string = "";
  category_id: string = "";
  location_id: string;
  location_name: string = "";
  location_address1: string;
  location_address2: string;
  location_city : string;
  location_state : string;
  location_zipcode: string;
  status: string;
  visibility: string;

  //these four attributes only show up if admin call is made
  volunteercount: string;
  created_by_first_name: string = "";
  created_by_last_name: string = "";
  created_by: string;

}
