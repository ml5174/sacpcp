import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "sortEvents"})
export class EventSortPipe {
  transform(object: any, args: string): Array<any> {
    object.sort((a: any, b: any) => {
	    if ( a[args] < b[args] ){
	    	return -1;
	    }else if( a[args] > b[args] ){
	        return 1;
	    }else{
	    	return 0;	
	    }
    });
    return object;
  }
}

