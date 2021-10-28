import { Component } from '@angular/core';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileQuery } from '@dragonfish/client/repository/profile';

@Component({
    selector: 'dragonfish-bookshelf-page',
    templateUrl: './bookshelf-page.component.html',
    styleUrls: ['./bookshelf-page.component.scss'],
})
export class BookshelfPageComponent {
    constructor(public auth: AuthService, public profile: ProfileQuery) {}
}
