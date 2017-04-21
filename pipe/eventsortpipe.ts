import { Pipe } from '@angular/core';

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

@Pipe({name: "OpportunityPipe"})
export class OpportunityPipe {
  transform(object: any, args?: any): any {
    console.log('object: ' + args);
	 
			if(args < 1 || args === undefined){
				return object;
			}else{
				return object.filter(function(param){
					if(param.category_id == args){
						return param;
					}

				});

			}

    
  }
}