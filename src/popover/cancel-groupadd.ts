import { Component } from '@angular/core';

@Component({
  template: `
  <section>
    <p>Would you like to complete the group creation before leaving this page?</p> 
    <button ion-button (click)="finishAction()">Yes</button><button>No</button>
  </section>
  `
})
export class CancelGroupAddPopover {
  constructor() {
  }
}
