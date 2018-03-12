import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserServices } from '../../../lib/service/user';
import { VolunteerEventsService } from '../../../lib/service/volunteer-events-service';
import { ModalController } from 'ionic-angular';
import { Message } from './message';
import { OrganizationServices } from '../../../lib/service/organization';

@Component({
    templateUrl: 'message-target-list.html',
    selector: 'message-target-list'
})
export class MessageTargetList implements OnChanges {

    @Input() listType: string = "event";
    getGroupsError: boolean;

    constructor(
        public userServices: UserServices,
        public volunteerEventsService: VolunteerEventsService,
        public organizationService: OrganizationServices
    ) { }

    public allChecked: boolean;
    public listMetaData: any;
    public listItems: Array<any> = [];

    // existing member vars

    public sendTo: string;
    public serviceError: boolean = false;

    ngOnInit() {
        this.listMetaData = {
            individual: {
                header: ["First Name", "Last Name", "Contact Method", "Email/Mobile Number"],
                fields: ["first_name", "last_name", "contactmethod", "mobilenumber"]
            },
            events: {
                header: ["Event Name", "Event Date", "Event Location"],
                fields: ["title", "start", "location_name"]
            },
            groups: {
                header: ["Org Name", "Org Type", "Group Name"],
                fields: ["name", "org_type", "group"]
            }
        };


        // this.sendTo = 'individual';
        // this.userServices.getAllUsers().subscribe(
        //   users => {
        //     for (var user of users) {
        //       if (user.contactmethod != null && user.first_name != '' && user.first_name != null)
        //         this.users.push(user);
        //     }
        //   },
        //   err => this.getUsersError = true,
        //   () => this.toggleSelectAllUsers(true)
        // );
        // this.volunteerEventsService.getVolunteerEvents().subscribe(
        //   events => {
        //     this.events = events;
        //   },
        //   err => this.getEventsError = true,
        //   () => this.toggleSelectAllEvents(true)
        // );
        // this.organizationService.getAllOrgNames().subscribe(
        //   groups => {
        //     console.log("Groups: " + JSON.stringify(groups));
        //     for (let g of groups) {
        //       if (g.status == 0)
        //         this.groups.push(g);
        //     }
        //   },
        //   err => {this.getGroupsError = true;}
        // );
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("Something Changed")
        if (changes.listType) {
            this.listItems = [];            
            switch (changes.listType.currentValue) {
                case "groups":
                    this.organizationService.getAllGroups().subscribe(
                        groups => {

                            for (let group of groups) {
                                if (true || group.status == 0 ) {
                                    this.listItems.push(group);
                                    console.log(JSON.stringify(group));
                                }
                            }
                            console.log("group count: " + this.listItems.length);

                        },
                        err => { this.serviceError = true; }
                    ); 
                    break;
                case "events":
                    this.volunteerEventsService.getVolunteerEvents().subscribe(
                        events => {
                            for (let e of events) {
                                this.listItems.push(e);
                                console.log(JSON.stringify(e));
                            }
                            console.log("event count: " + this.listItems.length);
                        },
                        err => { this.serviceError = true; }
                    );
                    break;
                case "individual":
                default:
                    this.userServices.getAllUsers().subscribe(
                        users => {
                            for (let user of users) {
                                if (true || user.contactmethod != null && user.first_name != '' && user.first_name != null &&
                                        user.mobilenumber !=null && user.active == 1) {
                                    this.listItems.push(user);
                                    console.log(JSON.stringify(user));
                                }
                            }
                            console.log("user count: " + this.listItems.length);

                        },
                        err => {this.serviceError = true; }
                    );                   
                    break;
            }
        }
    }

    public isDate(d: any): boolean {
        return d instanceof Date;
    }

    toggleSelectAll() {
        //console.log("toggleSelectAll: " + JSON.stringify(e.target.value));
        console.log("toggleSelectAll: " + this.allChecked);
    }

}
