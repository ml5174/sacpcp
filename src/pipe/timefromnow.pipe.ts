import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({name: 'timeFromNow'})
export class TimeFromNowPipe implements PipeTransform {
  transform(value: string) {
    return moment(value).fromNow(true);
  }
}