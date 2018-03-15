import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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


    @Input() listType: string;

    constructor(
        public userServices: UserServices,
        public volunteerEventsService: VolunteerEventsService,
        public organizationService: OrganizationServices,
        private fb: FormBuilder) {
        this.createForm();
    }

    public listMetaData: any;
    public listItems: Array<any> = [];
    public listingForm: FormGroup;
    public loadingAlertText: string;
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

    }

    createForm() {
        this.listingForm = this.fb.group({
            allChecked: '',
            listingsArray: this.fb.array([])
        });
    }

    rebuildForm() {
        this.listingForm.reset({
            allChecked: false
        });
        this.setListings(this.listItems);
    }

    setListings(listing: any[]) {
        const listFGs = listing.map(item => this.fb.group(item));
        this.listingForm.setControl('listingsArray', this.fb.array(listFGs));
    }

    public get listingsArray(): FormArray {
        return this.listingForm.get('listingsArray') as FormArray;
      };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.listType) {
            this.listItems = [];
            switch (changes.listType.currentValue) {
                case "groups":
                    this.organizationService.getAllGroups().subscribe(
                        groups => {

                            for (let g of groups) {
                                if (true || g.status == 0) {
                                    g.sendto = false;
                                    this.listItems.push(g);
                                }
                            }
                            this.rebuildForm();
                        },
                        err => { this.serviceError = true; }
                    );
                    break;
                case "events":
                    this.volunteerEventsService.getVolunteerEvents().subscribe(
                        events => {
                            for (let e of events) {
                                e.sendto = false;
                                this.listItems.push(e);
                            }
                            this.rebuildForm();
                        },
                        err => { this.serviceError = true; }
                    );
                    break;
                case "individual":
                default:
                    this.userServices.getAllUsers().subscribe(
                        users => {
                            for (let u of users) {
                                if (true || u.contactmethod != null && u.first_name != '' && u.first_name != null &&
                                    u.mobilenumber != null && u.active == 1) {
                                    u.sendto = false;
                                    this.listItems.push(u);
                                }
                            }
                            this.rebuildForm();
                        },
                        err => { this.serviceError = true; }
                    );
                    break;
            }
        }
    }
    public areSomeChecked(): boolean {
        for(let control of this.listingsArray.controls) {
            if(control.value.sendto == true) {
                return true;
            }
        }
        return false;
    }

    toggleSelectAll() {
        let isChecked = this.listingForm.controls.allChecked.value;
        for( let control of this.listingsArray.controls) {
            control.patchValue({ sendto: isChecked});
        }
    }
}
