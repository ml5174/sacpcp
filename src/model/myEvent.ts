export class MyEvent {
  event_id: string;
  contact_id: number;
  start: Date = new Date();
  end: Date = new Date();
  title: string = "";
  description: string = "";
  notification_options: number;
}