import { Component } from '@angular/core';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';

@Component({
    selector: 'dragonfish-section-page',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.scss'],
})
export class SectionPageComponent {
    constructor(
        public sectionsQuery: SectionsQuery,
        private sectionsService: SectionsService,
        public auth: AuthService,
        public workPageQuery: WorkPageQuery,
    ) {}
}
