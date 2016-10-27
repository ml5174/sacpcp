import { Component } from '@angular/core';

@Component({
  template: `
  <section padding>
    <p>Password can't contain consecutive characters of your user name.</p> 
    <p>Please use complex passwords.</p> 
    <p>A complex password is defined as having three out of the following four characters:
    </p>
    <ul>
    <li>Upper case English letters A-Z</li>
    <li>Lower case English letters a-z</li>
    <li>Number 0 to 9</li>
    <li>Non-alphanumeric characters " # $ % & ' ( ) * + , - . : ; < = > ? @ [ \ ] ^ _  </li>
    </ul>
    <p>Minimum password length of 8 characters</p>
    <p>Maximum password length of 32 characters.
    </p>
  </section>
  `
})
export class PasswordPopover {
  constructor() {
  }
}

