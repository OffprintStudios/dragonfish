import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'localedate'})
export class LocaleDatePipe implements PipeTransform  {
    transform(value: Date): string {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return value.toLocaleDateString(undefined, options);
    }
}
