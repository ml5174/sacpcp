import { Component } from '@angular/core';

@Component({
  template: `
  <section padding>
    <p>Minimum User ID length of 8 characters.</p> 
    <p>Maximum User ID length of 30 characters.</p> 
  </section>
  `
})
export class UseridPopover {
  constructor() {
  }
}

