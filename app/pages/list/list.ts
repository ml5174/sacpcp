import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Services} from '../../service/services';
import {Service} from '../../model/service';

@Component({
  templateUrl: 'build/pages/list/list.html',
  providers: [Services]
})
export class ListPage {
  services: Array<Service>;
  keys: Array<any>=[];
  constructor(private navCtrl: NavController,
              private serv: Services
  ) {
  }
  ngOnInit(){
    this.getServices();
  }
  getServices() {
    this.serv
        .getServices().subscribe(
                               services => {
                                 this.services = services;
                               }, 
                                err => {
                                    console.log(err);
                                });
  }
  getKeys(service) {
    return Object.keys(service.structure);
  }
}
