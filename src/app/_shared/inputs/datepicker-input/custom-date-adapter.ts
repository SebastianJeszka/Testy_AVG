import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    if (typeof value === 'string') {
      let str = [];
      if (value.indexOf('/') > -1) {
        str = value.split('/');
      } else if (value.indexOf('.') > -1) {
        str = value.split('.');
      }
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    }

    return null;
  }

  format(date: Date, displayFormat: Object): string {
    date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    );
    const days = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${days < 10 ? '0' : ''}${days}/${month < 10 ? '0' : ''}${month}/${year}`;
  }
}
