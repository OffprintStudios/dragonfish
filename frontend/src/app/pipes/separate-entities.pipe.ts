import { Pipe, PipeTransform } from '@angular/core';
import { Categories, GenresFiction, GenresPoetry, Fandoms } from 'src/app/models/works';

@Pipe({name: 'separateEntities'})
export class SeparateEntitiesPipe implements PipeTransform {
    transform(value: GenresFiction[] | GenresPoetry[] | Fandoms[], category?: Categories) {
        if (Categories[category] === Categories.OriginalFiction || Categories[category] === Categories.Fanfiction) {
            if (value.length === 1) {
                return GenresFiction[value[0]];
              } else {
                const theseGenres: string[] = [GenresFiction[value[0]], GenresFiction[value[1]]];
                return theseGenres.join(', ');
              }
        } else if (Categories[category] === Categories.Poetry) {
            return GenresPoetry[value[0]];
        } else {
            if (value.length === 1) {
                return Fandoms[value[0]];
            } else {
                let theseFandoms: string[] = new Array();
                value.forEach(fandom => { theseFandoms.push(Fandoms[fandom]) });
                return theseFandoms.join(', ');
            }
        }
    }
}