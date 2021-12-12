import { Component, HostListener, OnInit } from '@angular/core';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/work-page/sections';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';
import { MatDialog } from '@angular/material/dialog';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { slugify } from 'voca';
import { isMobile } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-sections-list',
    templateUrl: './sections-list.component.html',
    styleUrls: ['./sections-list.component.scss'],
})
export class SectionsListComponent implements OnInit {
    mobileMode = false;
    constructor(
        public sectionsQuery: SectionsQuery,
        public auth: AuthService,
        public workPageQuery: WorkPageQuery,
        private sectionsService: SectionsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.onResize();
    }

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
    goToSectionAuthor(sectionId: string) {
        if (this.workPageQuery.contentKind === 'PoetryContent') {
            return [
                '/poetry',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'view-section',
                sectionId,
            ];
        } else if (this.workPageQuery.contentKind === 'ProseContent') {
            return [
                '/prose',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'view-section',
                sectionId,
            ];
        }
    }

    goToSectionReader(index: number, title: string) {
        if (this.workPageQuery.contentKind === 'PoetryContent') {
            return [
                '/poetry',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'section',
                index + 1,
                slugify(title),
            ];
        } else if (this.workPageQuery.contentKind === 'ProseContent') {
            return [
                '/prose',
                this.workPageQuery.contentId,
                slugify(this.workPageQuery.contentTitle),
                'section',
                index + 1,
                slugify(title),
            ];
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
