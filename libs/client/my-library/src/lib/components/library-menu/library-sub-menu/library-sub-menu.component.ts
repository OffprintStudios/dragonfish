import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContextMenuService, MenuComponent, MenuPackage } from '@ctrl/ngx-rightclick';
import { ContentModel } from '@dragonfish/shared/models/content';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { of } from 'rxjs';

@Component({
    selector: 'dragonfish-library-sub-menu',
    templateUrl: 'library-sub-menu.component.html',
    animations: [
        trigger('menu', [
            state('enter', style({ opacity: 1, marginTop: '0px', visibility: 'visible' })),
            state('exit, void', style({ opacity: 0, marginTop: '-15px' })),
            transition('* => *', animate('120ms ease-in')),
        ]),
    ],
})
export class LibrarySubMenuComponent extends MenuComponent {
    content: ContentModel | undefined;
    lazy = false;

    constructor(
        public menuPackage: MenuPackage,
        public contextMenu: ContextMenuService,
        public shelves: BookshelvesRepository,
        public library: ContentLibraryRepository,
        private profiles: PseudonymsQuery,
    ) {
        super(menuPackage, contextMenu);
        this.content = menuPackage.context;
    }

    handleClick() {
        // IMPORTANT: tells the menu how to close, and anything passed in here is given to (menuAction)
    }

    checkIfIn(shelfId: string) {
        if (this.content) {
            return this.shelves.checkItem(this.profiles.currentId as string, shelfId, this.content._id);
        } else {
            return of(false);
        }
    }
}
