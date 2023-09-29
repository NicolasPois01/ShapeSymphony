import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPadding'
})
export class ZeroPaddingPipe implements PipeTransform {

  transform(value: number): string {
    return ((value < 10 ? '0' + value : value) + '').slice(0, 2);
  }

}
