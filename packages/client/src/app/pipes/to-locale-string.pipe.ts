import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toLocaleString',
})
export class ToLocaleStringPipe implements PipeTransform {
    /**
     *
     * @param value Transforms the given value into a locale-specific string of itself
     * by calling `.toLocaleString()` on it.
     */
    transform(value: object | string | boolean | symbol | number): string {
        return value.toLocaleString();
    }
}
