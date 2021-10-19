import { Component } from '@angular/core';
import { ContentLibraryQuery, ContentLibraryService } from '@dragonfish/client/repository/content-library';

@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent {
    constructor(public libraryQuery: ContentLibraryQuery, private libraryService: ContentLibraryService) {}
}
