import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment-timezone';

@Pipe({name: 'parseTimeZone'})
export class MomentTimeZonePipe implements PipeTransform {
  transform(value: string, format: string) {
    //return moment.parseZone(value).format(format);
    //return moment(value).format(format);
    return moment.tz(value, "America/Chicago").format(format);
  }
}