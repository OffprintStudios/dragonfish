import { Pipe, PipeTransform } from '@angular/core';
import { Categories } from 'shared-models';

@Pipe({name: 'fixCategories'})
export class FixCategoriesPipe implements PipeTransform {
    transform(value: Categories) {
        return Categories[value];
    }
}