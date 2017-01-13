import { Component } from '@angular/core';

@Component({
  selector: 'home-tab',
  templateUrl: '/pages/home.html'
})

export class HomeTab {

  program: string = "selection";
  


homeSlideOptions = {
loop: true, 
pager: true, 
autoplay: 3000};

  constructor(
  ) {
  }
  
   switch_view(viewname){
   this.program = viewname;
   document.getElementById('programcard').scrollIntoView(true);
   
  }
  
}