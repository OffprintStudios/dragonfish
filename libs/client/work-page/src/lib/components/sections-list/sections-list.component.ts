import { Component } from '@angular/core';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';

@Component({
    selector: 'dragonfish-sections-list',
    templateUrl: './sections-list.component.html',
    styleUrls: ['./sections-list.component.scss'],
})
export class SectionsListComponent {
    constructor(
        public sectionsQuery: SectionsQuery,
        public auth: AuthService,
        public workPageQuery: WorkPageQuery,
        private sectionsService: SectionsService,
    ) {}

    pubUnPub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.sectionsService.publish(this.workPageQuery.contentId, section._id, pubStatus).subscribe();
    }
}
