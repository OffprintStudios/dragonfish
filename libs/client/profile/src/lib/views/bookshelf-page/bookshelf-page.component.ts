import { Component, OnInit } from '@angular/core';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileRepository } from '@dragonfish/client/repository/profile';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';
import { setThreePartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-bookshelf-page',
    templateUrl: './bookshelf-page.component.html',
    styleUrls: ['./bookshelf-page.component.scss'],
})
export class BookshelfPageComponent implements OnInit {
    moreMenuOpened = false;

    constructor(public auth: AuthService, public profile: ProfileRepository, public shelves: ShelvesPageRepository) {}

    ngOnInit(): void {
        if (this.shelves.current$) {
            this.shelves.current$.subscribe((shelf) => {
                setThreePartTitle(this.profile.screenName, shelf.name);
            })
        }
    }

    toggleMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }
}
