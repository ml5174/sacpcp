import { Component, ViewChild } from '@angular/core';
import { AboutPage } from '../../pages/about/about';
import { ContactPage } from '../../pages/contact/contact';

@Component({
  selector: 'about-us',
  templateUrl: 'about-us.html'
})

export class AboutUsPage { 

  program: string = "selection";
  aboutPage = AboutPage;
  contactPage = ContactPage
  constructor(
  ) {
  }
  
   switch_view(viewname){
   this.program = viewname;
   document.getElementById('programcard').scrollIntoView(true);
   
  }
  @ViewChild('homeSlider') homeSlider;
  
  changeSlides(event) {
    if(event.getActiveIndex() == 0){
      this.homeSlider.startAutoplay(3000);
    }
  }
}