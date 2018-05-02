import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'group-action.html',
    selector: 'group-action'
})
export class GroupAction implements OnInit {
    
    public fgAction: FormGroup;

    constructor(public params: NavParams, private fb: FormBuilder, public viewController: ViewController) {
    }

    dismiss() {
        this.viewController.dismiss();
    }
    
    isDisabled(): boolean {
        let retval = true;
        if(this.fgAction.controls.action.value == 1 /* Approve */) {
            retval = false;
        }
        else if(this.fgAction.controls.action.value == 2 /* Decline */ && this.fgAction.controls.comment.value.length > 0) {
            retval = false;
        }


        return retval;
    }
   
    
    save() {
        let action = this.fgAction.controls.action.value;
        let comment = this.fgAction.controls.comment.value;

        this.viewController.dismiss({action: action, comment: comment});
    }
    
    ngOnInit(): void {
        this.fgAction = this.fb.group( // set up the validation
            {
                action: 0,
                comment: '',
            }
        );
    }
}

