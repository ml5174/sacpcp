import {Component} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import {VolunteerEvent} from '../../model/volunteer-event';
import {VolunteerEventsService} from '../../service/volunteer-events-service';
import {EventImage} from '../../model/eventImage';
import { UserServices } from '../../service/user';

@Component({
  templateUrl: 'myevents.html',
  selector: 'myevents',
})

export class MyEventsPage{

  myEvents: Array<VolunteerEvent> = [];
  image: Array<EventImage>;
  loaded: boolean = true;
  subscription: Subscription;
  subscription2: Subscription;

  constructor(private volunteerEventsService: VolunteerEventsService,
              private userServices: UserServices
  ) { this.userServices = userServices; 
    };
  
  
  ngOnInit(){
      this.subscription = this.userServices.userIdChange$.subscribe(
        (value) => {console.log("change" + value);},
        err => console.log(err), 
        () => console.log("completed: ")
        );

      this.subscription2 = this.userServices.userIdSource.subscribe(
        (value) => {console.log("source" + value);},
        err => console.log(err), 
        () => console.log("completed: ")
        );
   }
  
  loadMyEvents(){
    console.log(this.myEvents)
    if(this.userServices.user.id){
         console.log("calling myevents with Token: " + this.userServices.user.id)
         this.volunteerEventsService
         .getMyEvents(this.userServices.user.id).subscribe(
                                myEvents => this.myEvents = myEvents, 
                                 err => {
                                     console.log(err);
                                 },
                                 () => console.log(this.myEvents)
                                 )};
  }

    populateSearchedEvents(ev: VolunteerEvent[]){
    this.myEvents = ev;
    for (let event of this.myEvents) {
     this.volunteerEventsService
        .getEventImage(event.id).subscribe(
                               image => {this.image = image;
                                         event.image = this.image;
                                         if(this.image.length==0){
                                            this.image[0] = new EventImage();
                                            event.image = this.image;};
                                        }, 
                                err => {
                                    console.log(err);
                                });
    }
  }
}