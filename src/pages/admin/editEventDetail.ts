import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, ToastController} from 'ionic-angular';
import { EventDetail } from '../../lib/model/event-detail';
import { VolunteerEventsService } from '../../lib/service/volunteer-events-service';
import { NOTIFICATION_OPTIONS, NOTIFICATION_SCHEDULE, AGE_RESTRICTION, GENDER_RESTRICTION, VOLUNTEER_RESTRICTION, EVENT_STATUS, SAMEDAY_RESTRICTION } from './../../lib/provider/eventConstants';
import { UserServices } from '../../lib/service/user';
@Component({
  templateUrl: 'editEventDetail.html'
})
export class EditEventDetailPage {
  public eventDetail: EventDetail;
  gender = GENDER_RESTRICTION;
  aRestriction = AGE_RESTRICTION;
  vRestriction = VOLUNTEER_RESTRICTION;
  sdRestriction = SAMEDAY_RESTRICTION;
  nOptions = NOTIFICATION_OPTIONS;  
  signedUp: Boolean = false;
  deregisterResult: any;
  showEditDetails:string ="hidden"; 
  cancelEditDetails:string ="hidden";

  constructor(private volunteerEventsService: VolunteerEventsService,
  private userServices: UserServices,
  public nav: NavController,
  public navParams: NavParams,
  public viewCtrl: ViewController,
  public toastController: ToastController) {
  this.eventDetail = this.navParams.get('eventDetailKey');
  this.signedUp =  this.navParams.get('signedUp');
   this.viewCtrl = viewCtrl;
  }

  back() {
    this.nav.pop();
  }


    presentToast(message: string) {
     let toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
     });
     toast.present();
    }


    signup(id) {
        this.volunteerEventsService
            .eventRegister(id).subscribe(
            event => {
                      console.log("signed up for event " + id);
                      this.presentToast("Event sign-up successful.");
            },
            err => {
                console.log(err);
                this.presentToast("Error signing up for event");               
            }, () => {
                this.signedUp = true;
                this.volunteerEventsService.loadMyEvents();
                this.getAdminEventDetails(id);
            });
    }
    deRegister(id) {
        this.volunteerEventsService
            .eventDeregister(id).subscribe(
            result => {
                       this.deregisterResult = result;
                       this.presentToast("You are no longer signed up for this event");                     
            },
            err => {
                console.log(err);
                this.presentToast("Error cancelling event registration");                
            }, () => {
                this.signedUp = false;
                this.getAdminEventDetails(id);
                this.volunteerEventsService.loadMyEvents();
            });
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }

    editEventDetailsAdmin(toggle)
    {
         this.showEditDetails = toggle;
    }
    
    cancelEventDetailsEdit(toggle)
    {
        this.cancelEditDetails = toggle;
    }

   // Update EventDetail
   updateEventDetails(id) {
        this.volunteerEventsService
            .updateEventDetails(this.eventDetail).subscribe(
            result => {
                       this.eventDetail = result;
                       this.presentToast("Event Detail Updated successful!");    
						   
            }, 
            err => {
                console.log(err);
                this.presentToast("Error in updating Event Details!");                
            }, () => {
                this.getAdminEventDetails(id);
               this.volunteerEventsService.loadMyEvents();

            });
    }

    

 getAdminEventDetails(id) {
        this.volunteerEventsService
            .getAdminEventDetails(id).
            subscribe(
            event =>{this.eventDetail = event, this.assignEventDetail(this.eventDetail)},
             err => {
                console.log(err);
            });
                
    }
     
   assignEventDetail(ed:EventDetail)
   {
     this.eventDetail=ed;
   }
    
}