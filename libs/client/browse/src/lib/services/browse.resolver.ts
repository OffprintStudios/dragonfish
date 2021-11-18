import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map, Observable, of, zip } from 'rxjs';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

@Injectable()
export class BrowseResolver implements Resolve<void> {
    constructor(
        private session: SessionQuery,
        private profiles: PseudonymsQuery,
        private library: ContentLibraryRepository,
        private shelves: BookshelvesRepository,
    ) {}

    resolve(): Observable<void> {
        if (this.session.isLoggedIn && this.profiles.hasSelectedPseud) {
            return zip(this.library.fetchLibrary(), this.shelves.fetchShelves()).pipe(
                map(() => {
                    return;
                }),
            );
        } else {
            return of(null).pipe(
                map(() => {
                    return;
                }),
            );
        }
    }
}
