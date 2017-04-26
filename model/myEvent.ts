export class MyEvent {
  event_id: string;
  contact_id: number;
  start: Date = new Date();
  end: Date = new Date();
  title: string = "";
  location_id: string;
  location_name: string = "";
  location_address1: string;
  location_address2: string;
  location_city: string;
  location_state: string;
  location_zipcode: string;
  description: string = "";
  notification_options: string;
  event_notification_schedule: string;
  overlap_override: boolean;
}