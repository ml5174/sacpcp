import { Component } from '@angular/core';

@Component({
  template: `
  <section padding>
    <p>Password can't contain consecutive characters of your user name.</p> 
    <p>Please use complex passwords.</p> 
  </section>
  `
})
export class PasswordPopover {
  constructor() {
  }
}

