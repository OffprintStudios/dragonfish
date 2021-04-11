import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    /**
     * Truncates a given string by the length specified.
     *
     * @param value The input string
     * @param length The desired truncation length
     */
    transform(value: string, length: number): string {
        if (value.length < length) {
            return value;
        } else {
            return value.substring(0, length) + '...';
        }
    }
}
