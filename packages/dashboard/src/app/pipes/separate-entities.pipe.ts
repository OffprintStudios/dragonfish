import { Pipe, PipeTransform } from '@angular/core';
import { GenresFiction, GenresPoetry, Genres, Categories, Fandoms } from '@pulp-fiction/models/works';

@Pipe({name: 'separateEntities'})
export class SeparateEntitiesPipe implements PipeTransform {
    transform(value: Genres[] | Fandoms[], category?: Categories) {
        if (Categories[category] === Categories.OriginalFiction || Categories[category] === Categories.Fanfiction) {
            if (value.length === 1) {
                return GenresFiction[value[0]];
              } else {
                let theseGenres: string[] = new Array();
                value.forEach(genre => { theseGenres.push(GenresFiction[genre]) });
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