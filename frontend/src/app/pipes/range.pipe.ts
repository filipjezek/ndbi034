import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {
  transform(value: unknown, start = 0, step = 1) {
    const end = isNaN(+(value as any)) ? 0 : +(value as any);
    if (step === 0) throw new Error('step cannot be 0');
    const range = [];
    for (let i = start; i != end; i += step) {
      range.push(i);
    }
    return range;
  }
}
