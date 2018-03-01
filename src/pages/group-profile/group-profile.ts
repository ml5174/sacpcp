import { Component } from '@angular/core';
import { IonicPage, NavController,ModalController, NavParams } from 'ionic-angular';

import { Organization } from '../../lib/model/organization';
import { AlertController } from 'ionic-angular';
import {UserServices} from '../../lib/service/user';
import { OrganizationServices } from '../../lib/service/organization';
import { MemberPopOver } from './member-popover';

@Component({
  selector: 'page-group-profile',
  templateUrl: 'group-profile.html',
  providers:[OrganizationServices,MemberPopOver],
  
  
})
export class GroupProfilePage {
public orgId: number = null;
public orgData: any = null;
public newMember: any =null;
public invitedHere: any =[];
public admins: any =[];
public nonadmins: any=[];
public canEdit:boolean=null;
public arrayOrgTypes: any =[];
public canEditOrg:boolean=false;
public orgChg:boolean=false;
public memberChg:boolean=false;
    
constructor(public navCtrl: NavController, public navParams: NavParams,
            public orgServices: OrganizationServices,public userService:UserServices,public alertCtrl:AlertController,
         
            public modalControl:ModalController,
            public m:MemberPopOver
            ) {}
     

 ionViewDidLoad() {
      
      
    console.log('ionViewDidLoad GroupProfilePage ' + this.navParams.get('orgid'));
      //thisOrgId=this.navParams.get('orgid');
      this.orgId=this.navParams.get('orgid');
      /* following is commented until back end works via post */
     
      this.loadOrgContacts(this.orgId);
      var page=this;
      this.orgServices.getOrgTypes().subscribe (orgData => {
            page.arrayOrgTypes=orgData;
           
            },
            err => {
                console.log("Unable to load organization Types in groupProfile page");
            });
         
         
        
  }
  public addNew()
    {
      
      

   let userPop = this.modalControl.create(MemberPopOver, {cssClass:"member-modal"});
   userPop.present();
 
       if (!this.canEdit)
       return;
       
        if (this.newMember )
        {
            if (this.newMember.visible)
            {
                return ;
            }
            else
             this.newMember.visible=true;
         }
        else
        {
            this.newMember={visible:true,status:0,first_name:"", emailOrNumber:null,contact_method:null,last_name:null, email:null, mobilenumber: null };
            
       }
    }
    
    
    public groupApproved()
    {
        if (this.orgData && this.orgData.organization )
        {
            return (this.orgData.organization.status == 0)
      
        }
        else
            {
            return (false);
        }
    }
    
    public decodeOrgType (orgType)
    {
        if (orgType == null)
            return ("Not Present");
        let i: number=0;
        for(i=0;  i <this.arrayOrgTypes.length ;i++)
        {
            if (this.arrayOrgTypes[i].id==orgType)
            {
                return this.arrayOrgTypes[i].name;
             }
        }
        return ("");
      }
    public decodeProfileStatus  (status) 
    {
        var codes=["None","Active","Inactive","Temporary"];
        return (codes[status]);
    }
    public decodeRole(role)
    {
        var roleEn=['Member','Admin'];
        return (roleEn[role]);
    }
    public validRoles()
    {
        return ([0,1]);
     }
  
    public confirmAdmDelete(admrecord) {
        let page=this;
        let alert = this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: 'Do you want to delete this member?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Delete',
                handler: () => {
                  page.deleteAdminRec(admrecord);
                }
              }
        ]
     });
  alert.present();
    }
    
    public confirmMemberDelete(record) {
        let page=this;
        let alert = this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: 'Do you want to delete this member?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Delete',
                handler: () => {
                  page.deleteMemberRec(record);
                }
              }
        ]
     });
  alert.present();
    }
    public deleteAdminRec (admrecord : any)
    {
        this.admins = this.admins.filter(obj => obj !== admrecord);
        this.memberChg=true;
    }
    public deleteMemberRec (member)
    {
        this.nonadmins = this.nonadmins.filter(obj => obj !== member);
        this.memberChg=true;
    }
    
    public canEditCheck ()
    {
        var prof=this.userService.user.profile;
        var contact_method=prof.contactmethod_name;
        var email=prof.email;
        var mobile=prof.mobilenumber;
        var userid=prof.user;
        if (this.admins)
        {
            var i;
            var admins =this.admins;
            for (i=0; i < admins.length; i++)
            {
                if (contact_method == 'Email')
                {
                  if (admins[i].email == email)
                  {
                      return true;
                  }    
                }
                if (contact_method == 'Phone')
                {
                    if (admins[i].email == email)
                    {
                         return true;
                    }   
                }
            }
         }
         return false;
    }
   
    showDelete(member)
    {
       if (this.canEdit)
       {
           if (!member.showDelete)
           { 
           member.showDelete=true;
            }
           else
            {
               member.showDelete=false;
             }
        }
    }
        
     
    groupAdmin(role)
    {
        return (role ==1 ) ;
     }
    sortMemberData(members)
    {
        var admins=[];
        var invited=[];
        var rest=[];
        var page=this;
        members.forEach (function (member)
        {
            member.showDelete=false;
            member.changed=false;
            member.new=false;
            member.isAdmin=false;
            if (member.role == 1 )
                 member.isAdmin=true;
            
            if (page.groupAdmin(member.role))
            {
                page.admins.push(member);
                return;
            }
            else
            {
               page.nonadmins.push(member);
            }
            if (typeof member.isEmailSelected != 'undefined')
            {
                if (member.isEmailSelected)
                {
                    member.contact_method='Email';
                }
            }
            if (typeof member.isPhoneSelected != 'undefined')
            {
                if (member.isPhoneSelected)
                {
                    member.contact_method='Phone';
                }
            }
          
        });
        
      };
      
    
    loadOrgContacts(orgId) {
    console.log("Group Profile: loadOrgContacts()  "+  orgId);
  
    var page = this;  
    this.orgServices.getOrganizationContacts(orgId).subscribe (orgData => {
     page.orgData=orgData;
      console.log("OrgData " + page.orgData.organization.upper_name );
      page.sortMemberData(this.orgData.members);
      page.canEdit=page.canEditCheck();
      page.canEditOrg=false;
    },
    err => {
        this.orgServices.getMyPendingOrganizationsDetails(orgId).subscribe(
         orgData => {
                page.orgData=orgData;
                // organization status is = 0 ->appoved. Should be 1 
                page.orgData.organization.status=1;
            console.log("OrgData " + page.orgData.organization.upper_name );
            page.sortMemberData(this.orgData.members);
            page.canEdit=page.canEditCheck();
            page.canEditOrg=true;
            },
            err2 => {
              console.log(err2);
                 this.orgData=null;
                }
            );
        console.log(err);
     
    });
  }
   
}
