import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPadding'
})
export class ZeroPaddingPipe implements PipeTransform {

  transform(value: number, isMilliseconds: boolean = false): string {
    if(isMilliseconds)
      return ((value < 10 ? '00' + value : (value < 100 ? '0' + value : value)) + '').slice(0, 3);
    return ((value < 10 ? '0' + value : value) + '').slice(0, 2);
  }

}
