import { Component } from '@angular/core';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileQuery } from '@dragonfish/client/repository/profile';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-bookshelves',
    templateUrl: './bookshelves.component.html',
    styleUrls: ['./bookshelves.component.scss'],
})
export class BookshelvesComponent {
    constructor(
        public auth: AuthService,
        public profile: ProfileQuery,
        public profileShelves: ShelvesPageRepository,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    goToShelf(id: string) {
        this.router.navigate(['bookshelf', id], { relativeTo: this.route.parent }).catch((err) => console.log(err));
    }
}
