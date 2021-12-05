import { Component, OnInit } from '@angular/core';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileRepository } from '@dragonfish/client/repository/profile';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';
import { ActivatedRoute, Router } from '@angular/router';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-bookshelves',
    templateUrl: './bookshelves.component.html',
    styleUrls: ['./bookshelves.component.scss'],
})
export class BookshelvesComponent implements OnInit {
    constructor(
        public auth: AuthService,
        public profile: ProfileRepository,
        public profileShelves: ShelvesPageRepository,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        setThreePartTitle(this.profile.screenName, Constants.BOOKSHELVES);
    }

    goToShelf(id: string) {
        this.router.navigate(['bookshelf', id], { relativeTo: this.route.parent }).catch((err) => console.log(err));
    }
}
