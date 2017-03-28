import { Component, Input, ViewChild} from '@angular/core'

@Component({
 selector: 'accordion-box',
  templateUrl: 'accordion-box.html'
})

export class AccordionBox {
	@Input() accordionTitle;
	@Input() scrollToTop: string;
	
	private title;
	private expanded:boolean = false;

	constructor() { }
	
	ngAfterViewInit(){
	this.title = this.accordionTitle;
	}
	
	onClick(event){
	this.expanded = !this.expanded;
	if(this.scrollToTop !== "false" && this.expanded === true){
  		var target = event.target.parentElement; 
  		setTimeout(function(){
  			target.scrollIntoView(true);
  		} , 100);
  	}
  	
  }

}