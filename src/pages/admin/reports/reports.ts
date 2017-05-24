import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VolunteerEventsService } from '../../../lib/service/volunteer-events-service';
import { VolunteerEvent } from '../../../lib/model/volunteer-event';
import 'rxjs/Rx';

@Component({
  templateUrl: 'reports.html'
})
export class Reports {
  public startDate:Date;
  public endDate: Date;
  public getEventsError:Boolean;
  public events:Array<VolunteerEvent>;
  constructor(public nav: NavController, public volunteerEventsService: VolunteerEventsService) {

  }
  back() {
    this.nav.pop();
  }
  exportEvents(){
    this.volunteerEventsService.getEventsReport({'start': this.startDate, 'end': this.endDate}).subscribe(data => {this.downloadFile(data)}, err => { console.log(err); this.getEventsError = true;});
  }
  downloadFile(data) {
    var blob = new Blob([data],{type:'text/csv'});
    var url = URL.createObjectURL(blob);
    var x = document.createElement('a');
    x.href = url;
    x.setAttribute('download','events.csv');
    document.body.appendChild(x);
    x.click();
    document.body.removeChild(x);
  }


}
