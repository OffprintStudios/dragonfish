import { Component } from '@angular/core';
import { ContentLibraryQuery } from '@dragonfish/client/repository/content-library';

@Component({
    selector: 'dragonfish-works-list',
    templateUrl: './works-list.component.html',
})
export class WorksListComponent {
    constructor(public library: ContentLibraryQuery) {}
}
