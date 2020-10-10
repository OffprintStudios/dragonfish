import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

/**
 * This was borrowed from StackOverflow.
 * 
 * Link: https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
 */
@Pipe({name: 'abbreviate'})
export class AbbreviateNumbersPipe implements PipeTransform {
    transform(value: number) {
        if (value < 1000) {
            return value.toLocaleString();
        } else {
            return numeral(value).format('0.0a');
        }
    }
}