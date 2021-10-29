import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';
import { Observable } from 'rxjs';

@Injectable()
export class BookshelvesResolver implements Resolve<void> {
    constructor(private profileShelves: ShelvesPageRepository) {}

    resolve(): Observable<void> {
        return this.profileShelves.fetchShelves();
    }
}
