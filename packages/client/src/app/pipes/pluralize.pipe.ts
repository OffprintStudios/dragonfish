import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pluralize'})
export class PluralizePipe implements PipeTransform  {
    transform(value: number, prefix?: string): string {
        if (prefix)  {
            if (value === 0 || value > 1) {
                return prefix;
            } else {
                return '';
            }
        } else if (value === 0 || value > 1) {
            return 's';
        } else {
            return '';
        }
    }
}
