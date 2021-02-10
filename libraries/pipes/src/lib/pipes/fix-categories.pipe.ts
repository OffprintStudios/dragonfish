import { Pipe, PipeTransform } from '@angular/core';
import { WorkKind } from '@dragonfish/models/content';
import { Categories } from '@dragonfish/models/works';

@Pipe({ name: 'fixCategories' })
export class FixCategoriesPipe implements PipeTransform {
    transform(value: Categories | WorkKind) {
        if (value in Categories) {
            return Categories[value];
        } else if (value in WorkKind) {
            return WorkKind[value];
        }
    }
}
