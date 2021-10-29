import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';
import { Observable } from 'rxjs';

@Injectable()
export class BookshelfResolver implements Resolve<void> {
    constructor(private profileShelves: ShelvesPageRepository) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        const id = route.paramMap.get('id');
        return this.profileShelves.fetchOneShelf(id);
    }
}
