import { Component } from '@angular/core';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { LibraryMenuComponent } from '../../components/library-menu/library-menu.component';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';

@Component({
    selector: 'dragonfish-works-list',
    templateUrl: './works-list.component.html',
})
export class WorksListComponent {
    menu = LibraryMenuComponent;

    constructor(public library: ContentLibraryRepository, private shelves: BookshelvesRepository) {}

    setCurrent(itemId: string) {
        this.library.setCurrent(itemId);
    }

    deselect() {
        this.library.deselect();
    }
}
