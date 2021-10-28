import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContextMenuService, MenuComponent, MenuPackage } from '@ctrl/ngx-rightclick';
import { ContentModel } from '@dragonfish/shared/models/content';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-shelf-menu',
    templateUrl: './shelf-menu.component.html',
    animations: [
        trigger('menu', [
            state('enter', style({ opacity: 1, marginTop: '0px', visibility: 'visible' })),
            state('exit, void', style({ opacity: 0, marginTop: '-15px' })),
            transition('* => *', animate('120ms ease-in')),
        ]),
    ],
})
export class ShelfMenuComponent extends MenuComponent {
    content: ContentModel | undefined;
    lazy = false;

    constructor(
        public menuPackage: MenuPackage,
        public contextMenu: ContextMenuService,
        public shelves: BookshelvesRepository,
        public library: ContentLibraryRepository,
        private profiles: PseudonymsQuery,
        private dialog: MatDialog,
    ) {
        super(menuPackage, contextMenu);
        this.content = menuPackage.context;
    }

    removeFromShelf() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to remove this from this shelf?',
            confirm: true,
        };
        this.openAlert(alertData)
            .afterClosed()
            .pipe(take(1))
            .subscribe((wantsToDelete: boolean) => {
                if (wantsToDelete && this.profiles.currentId && this.content) {
                    this.shelves
                        .removeItem(this.profiles.currentId, this.shelves.currentId, this.content._id)
                        .subscribe(() => {
                            this.contextMenu.closeAll();
                        });
                }
            });
    }

    removeFromLibrary() {
        const alertData: PopupModel = {
            message: `Are you sure you want to remove this from your library?\nThis work will also be removed from all bookshelves you've added it to.`,
            confirm: true,
        };
        this.openAlert(alertData)
            .afterClosed()
            .pipe(take(1))
            .subscribe((wantsToDelete: boolean) => {
                if (wantsToDelete && this.profiles.currentId && this.content) {
                    this.library.removeFromLibrary(this.content._id).subscribe(() => {
                        this.contextMenu.closeAll();
                    });
                }
            });
    }

    private openAlert(data: PopupModel) {
        return this.dialog.open(PopupComponent, { data: data });
    }
}
