import { Pipe, PipeTransform } from '@angular/core';

import { WorkMetadata, Categories, GenresFiction, GenresPoetry, Fandoms } from 'src/app/models/works';


@Pipe({name: 'stringifyMeta'})
export class StringifyMetaPipe implements PipeTransform {
    /**
     * Transforms a work's _meta_ object into a string suitable for display to the client.
     * @param value The work's _meta_ object, of type WorkMetadata.
     */
    transform(value: WorkMetadata) {
        const categoryString: string = Categories[value.category];
        if (Categories[value.category] === Categories.Poetry) {
            return `${categoryString} // ${GenresPoetry[value[0]]}`;
        }
        
        const genreString: string = value.genres.length === 1 
            ? GenresFiction[value.genres[0]]
            : [GenresFiction[value.genres[0]], GenresFiction[value.genres[1]]].join(', ');

        if (Categories[value.category] === Categories.OriginalFiction) {
            return `${categoryString} // ${genreString}`;
        }
        if (!value.fandoms || value.fandoms.length === 0) {
            return `${categoryString} // ${genreString}`;
        }

        const fandomString: string = value.fandoms.length === 1
            ? Fandoms[value.fandoms[0]]
            : value.fandoms.map(x => Fandoms[x]).join(', ');

        return `${categoryString} // ${genreString} // ${fandomString}`;
    }
}