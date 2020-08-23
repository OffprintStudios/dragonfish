import { Pipe, PipeTransform } from '@angular/core';
import { Categories } from '@pulp-fiction/models/works';

@Pipe({name: 'fixCategories'})
export class FixCategoriesPipe implements PipeTransform {
    transform(value: Categories) {
        return Categories[value];
    }
}