import { Component } from '@angular/core';

@Component({
  selector: 'home-tab',
  templateUrl: '/pages/home.html'
})

export class HomeTab {

homeSlideOptions = {
loop: true, 
pager: true, 
autoplay: 3000};
  constructor(
  ) {
  }
}