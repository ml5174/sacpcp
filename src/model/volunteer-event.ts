import {EventImage} from './eventImage';

export class VolunteerEvent {
  id: number;
  title: string = "";
  category: string ="";
  description: string = "";
  start: Date = new Date();
  end: Date = new Date();
  rule: string;
  end_recurring_period: string;
  location_id: string;
  location_name: string = "";
  created_by: string = "";
  image: Array<EventImage> = [new EventImage()];

}
