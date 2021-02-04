import { Pipe, PipeTransform } from '@angular/core';
import { Genres } from '@dragonfish/models/content';

@Pipe({name: 'separateGenres'})
export class SeparateGenresPipe implements PipeTransform {
    transform(value: Genres[]) {
        if (value.length === 1) {
            return Genres[value[0]];
        } else {
            let theseGenres: string[] = new Array();
            value.forEach(genre => { theseGenres.push(Genres[genre]) });
            return theseGenres.join(', ');
        }        
    }
}