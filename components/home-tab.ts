import { Component } from '@angular/core';

@Component({
  selector: 'home-tab',
  templateUrl: 'home.html'
})

export class HomeTab { 

  program: string = "selection";

  constructor(
  ) {
  }
  
   switch_view(viewname){
   this.program = viewname;
   document.getElementById('programcard').scrollIntoView(true);
   
  }
  
}