import { Component } from '@angular/core';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { LibraryMenuComponent } from '../../components/library-menu/library-menu.component';
import { NotificationsRepository } from '@dragonfish/client/repository/notifications';

@Component({
    selector: 'dragonfish-works-list',
    templateUrl: './works-list.component.html',
})
export class WorksListComponent {
    menu = LibraryMenuComponent;

    constructor(public library: ContentLibraryRepository, public notifications: NotificationsRepository) {}

    setCurrent(itemId: string) {
        this.library.setCurrent(itemId);
    }

    deselect() {
        this.library.deselect();
    }
}
