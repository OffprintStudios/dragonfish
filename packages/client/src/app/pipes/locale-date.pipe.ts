import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'localedate'})
export class LocaleDatePipe implements PipeTransform  {
    transform(value: Date | string): string {
        const date = new Date(value);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}
