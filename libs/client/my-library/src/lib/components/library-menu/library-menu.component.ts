import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ContentModel } from '@dragonfish/shared/models/content';
import { ContextMenuService, MenuComponent, MenuPackage } from '@ctrl/ngx-rightclick';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { LibrarySubMenuComponent } from './library-sub-menu/library-sub-menu.component';

@Component({
    selector: 'dragonfish-library-menu',
    templateUrl: './library-menu.component.html',
    animations: [
        trigger('menu', [
            state('enter', style({ opacity: 1, marginTop: '0px', visibility: 'visible' })),
            state('exit, void', style({ opacity: 0, marginTop: '-15px' })),
            transition('* => *', animate('120ms ease-in')),
        ]),
    ],
})
export class LibraryMenuComponent extends MenuComponent {
    content: ContentModel | undefined;
    lazy = false;
    subMenu = LibrarySubMenuComponent;

    constructor(
        public menuPackage: MenuPackage,
        public contextMenu: ContextMenuService,
        public shelves: BookshelvesRepository,
        public library: ContentLibraryRepository,
    ) {
        super(menuPackage, contextMenu);
        this.content = menuPackage.context;
    }

    handleClick() {
        // IMPORTANT: tells the menu how to close, and anything passed in here is given to (menuAction)
    }
}
