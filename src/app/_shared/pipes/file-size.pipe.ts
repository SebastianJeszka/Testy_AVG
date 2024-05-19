import { Pipe, PipeTransform } from '@angular/core';

const UNITS = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+precision) + ' ' + UNITS[unit];
  }
}
