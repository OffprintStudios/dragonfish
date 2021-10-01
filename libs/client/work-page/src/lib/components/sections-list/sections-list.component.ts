import { Component } from '@angular/core';
import { SectionsQuery } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';

@Component({
    selector: 'dragonfish-sections-list',
    templateUrl: './sections-list.component.html',
    styleUrls: ['./sections-list.component.scss'],
})
export class SectionsListComponent {
    constructor(public sectionsQuery: SectionsQuery, public auth: AuthService, public workPageQuery: WorkPageQuery) {}
}
