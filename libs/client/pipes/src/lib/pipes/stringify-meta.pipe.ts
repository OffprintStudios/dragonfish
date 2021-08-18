import { Pipe, PipeTransform } from '@angular/core';

import { WorkMetadata, Categories, GenresFiction, GenresPoetry } from '@dragonfish/shared/models/works';

@Pipe({ name: 'stringifyMeta' })
export class StringifyMetaPipe implements PipeTransform {
    /**
     * Transforms a work's _meta_ object into a string suitable for display to the client.
     * @param value The work's _meta_ object, of type WorkMetadata.
     */
    transform(value: WorkMetadata) {
        const categoryString: string = Categories[value.category];
        if (Categories[value.category] === Categories.Poetry) {
            return `${categoryString} // ${GenresPoetry[value.genres[0]]}`;
        }

        const genreString: string =
            value.genres.length === 1
                ? GenresFiction[value.genres[0]]
                : [GenresFiction[value.genres[0]], GenresFiction[value.genres[1]]].join(', ');

        if (Categories[value.category] === Categories.OriginalFiction) {
            return `${categoryString} // ${genreString}`;
        }
        // Insert fandom tags code later for Fanwork
        return `${categoryString} // ${genreString}`;
    }
}
