import { Component } from '@angular/core';

@Component({
  template: `
  <section padding>
    <p>Minimum Username length of 8 characters.</p> 
    <p>Maximum Username length of 30 characters.</p>
    <p>Username must begin with a letter.</p>
    <p>Username may only contain alphanumeric, _, @, +, . and - characters.</p>
  </section>
  `
})
export class UseridPopover {
  constructor() {
  }
}

