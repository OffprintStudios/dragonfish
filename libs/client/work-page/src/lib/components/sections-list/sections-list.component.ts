import { Component } from '@angular/core';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';
import { MatDialog } from '@angular/material/dialog';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';

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
        private dialog: MatDialog,
    ) {}

    pubUnPub(section: Section) {
        const pubStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        this.sectionsService.publish(this.workPageQuery.contentId, section._id, pubStatus).subscribe();
    }

    delete(sectionId: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.sectionsService.delete(this.workPageQuery.contentId, sectionId).subscribe();
            }
        });
    }
}
