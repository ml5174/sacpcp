import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment-timezone';


@Pipe({name: 'parseTimeZone'})
export class MomentTimeZonePipe implements PipeTransform {
  transform(value: string, format: string, timezone: string) {
    
    //commonly used timezones could be encoded here for ease of use
    //America/Chicago

    return moment.tz(value, timezone).format(format);
  }
}