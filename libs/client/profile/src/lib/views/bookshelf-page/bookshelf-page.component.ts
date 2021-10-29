import { Component } from '@angular/core';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileQuery } from '@dragonfish/client/repository/profile';
import { ShelvesPageRepository } from '@dragonfish/client/repository/profile/shelves-page';

@Component({
    selector: 'dragonfish-bookshelf-page',
    templateUrl: './bookshelf-page.component.html',
    styleUrls: ['./bookshelf-page.component.scss'],
})
export class BookshelfPageComponent {
    moreMenuOpened = false;

    constructor(public auth: AuthService, public profile: ProfileQuery, public shelves: ShelvesPageRepository) {}

    toggleMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }
}
