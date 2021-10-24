import { Component } from '@angular/core';
import { ContentLibraryQuery } from '@dragonfish/client/repository/content-library';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';

@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent {
    constructor(public libraryQuery: ContentLibraryQuery, public shelves: BookshelvesRepository) {}
}
