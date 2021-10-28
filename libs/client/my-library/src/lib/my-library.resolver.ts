import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map, Observable, zip } from 'rxjs';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';

@Injectable()
export class MyLibraryResolver implements Resolve<void> {
    constructor(private library: ContentLibraryRepository, private shelves: BookshelvesRepository) {}

    resolve(): Observable<void> {
        return zip(this.library.fetchLibrary(), this.shelves.fetchShelves()).pipe(
            map(() => {
                return;
            }),
        );
    }
}
