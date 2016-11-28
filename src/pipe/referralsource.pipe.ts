import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'referralsource'})

export class ReferralSourcePipe implements PipeTransform {
  transform(items: any[], volunteerType: number): any[] {
        let resultArray = [];

        if (volunteerType) {
            let type = volunteerType;
            if (type == 7) {
                type = 0;
            } else if (type == 8) {
                type = 1;
            }
            for (let item of items) {
                if (item.type == type) {
                    resultArray.push(item);
                }
            }
        } 

        return resultArray;
    }
}
