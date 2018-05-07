import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'group-action.html',
    selector: 'group-action'
})

/**
 *  This class will support two sets of actions - Approve/Decline and Active/Inactive
 */

export class GroupAction implements OnInit {
    
    mode: string;
    public fgAction: FormGroup;
    public myOrg: any;
    public groupText: string;
    public title: string;

    constructor(params: NavParams, private fb: FormBuilder, public viewController: ViewController) {
        this.myOrg = params.get("org");
        this.groupText = this.myOrg.group;
        this.mode = params.get("mode");
        this.title = (this.mode === 'approval' ? 'Group Approve/Decline' : 'Group Active/Inactive'); 
    }

    cancel() {
        this.viewController.dismiss();
    }
    
    isSaveDisabled(): boolean {
        let retval = true;
        if(this.fgAction.controls.action.value == 'approve' /* Approve */) {
            retval = false;
        }
        else if(this.fgAction.controls.action.value == 'decline' /* Decline */ && this.fgAction.controls.comment.value.length > 0) {
            retval = false;
        }
        else if(this.mode === "active") {
            retval = false;
        }
        return retval;
    }

    isDeclining(): boolean {
        return this.fgAction.controls.action.value == 'decline' && this.mode === "approval";
    }
   
    save() {
        let action = this.fgAction.controls.action.value;
        let comment = this.fgAction.controls.comment.value;

        this.viewController.dismiss({action: action, comment: comment, id: this.myOrg.id});
    }
    
    ngOnInit(): void {
        let actionValue = 'pending';
        if(this.mode == 'active') {
            actionValue = this.myOrg.status == 0 ? 'inactive' : 'active';
        }
        this.fgAction = this.fb.group( // set up the validation TODO: fix to use active/inactive appropriately
            {
                action: this.mode === 'approval' ? 'pending' : 'active',
                comment: ''
            }
        );
    }
}

