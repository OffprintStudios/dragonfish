import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

@Injectable()
export class BookshelfResolver implements Resolve<void> {
    constructor(private pseudQuery: PseudonymsQuery, private shelves: BookshelvesRepository) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        const id = route.paramMap.get('id');

        return this.shelves.fetchShelfItems(this.pseudQuery.currentId as string, id as string).pipe(
            tap(() => {
                this.shelves.setCurrent(id as string);
            }),
        );
    }
}
