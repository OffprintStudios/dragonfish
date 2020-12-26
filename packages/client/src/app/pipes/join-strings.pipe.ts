import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'joinStrings'})
export class JoinStringsPipe implements PipeTransform {
    transform(value: string[]) {
        if (value.length === 1) {
            return value[0];
        } else {
            return value.join(", ");
        }        
    }
}