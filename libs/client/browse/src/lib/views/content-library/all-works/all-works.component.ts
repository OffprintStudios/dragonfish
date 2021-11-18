import { Component } from '@angular/core';
import { ContentLibraryRepository } from '@dragonfish/client/repository/content-library';
import { NotificationsRepository } from '@dragonfish/client/repository/notifications';
import { LibraryMenuComponent } from '../../../components';

@Component({
    selector: 'dragonfish-all-works',
    templateUrl: './all-works.component.html',
})
export class AllWorksComponent {
    menu = LibraryMenuComponent;

    constructor(public library: ContentLibraryRepository, public notifications: NotificationsRepository) {}

    setCurrent(itemId: string) {
        this.library.setCurrent(itemId);
    }

    deselect() {
        this.library.deselect();
    }
}
