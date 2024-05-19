import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], propertyName: string, direction: 'asc' | 'desc' = 'asc'): any[] {
    if (propertyName) {
      return value.sort((a: any, b: any) => {
        if (typeof a[propertyName] === 'number') {
          if (direction === 'asc') {
            return a[propertyName] - b[propertyName];
          } else {
            return b[propertyName] - a[propertyName];
          }
        } else if (typeof a[propertyName] === 'string') {
          if (direction === 'asc') {
            return a[propertyName].localeCompare(b[propertyName]);
          } else {
            return b[propertyName].localeCompare(a[propertyName]);
          }
        } else if (typeof a[propertyName] === 'boolean') {
          if (direction === 'asc') {
            return a[propertyName] === b[propertyName] ? 0 : a[propertyName] ? -1 : 1;
          } else {
            return a[propertyName] === b[propertyName] ? 0 : a[propertyName] ? 1 : -1;
          }
        }
      });
    }

    return value;
  }
}
