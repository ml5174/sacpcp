import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/*
This will return the time as dictated by the UTC offset
*/

@Pipe({name: 'parseTime'})
export class ParseTimePipe implements PipeTransform {
  transform(value: string, format: string) {
  return moment(value).utcOffset(value).format(format);
  }
}