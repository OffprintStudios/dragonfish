import { Component, Input, OnInit } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind, Genres, PubStatus, TagKind } from '@dragonfish/shared/models/content';
import { UploadCoverArtComponent } from '../upload-cover-art/upload-cover-art.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { slugify } from 'voca';
import { WorkPageQuery, WorkPageService } from '@dragonfish/client/repository/work-page';
import { WorkFormComponent, WorkFormData } from '@dragonfish/client/ui';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-work-banner',
    templateUrl: './work-banner.component.html',
    styleUrls: ['./work-banner.component.scss'],
})
export class WorkBannerComponent implements OnInit {
    @Input() content;
    contentUrl = [];
    moreMenuOpened = false;
    tagKind = TagKind;
    genres = Genres;
    pubStatus = PubStatus;
    loadingLibrary = false;

    constructor(
        private alerts: AlertsService,
        private dialog: MatDialog,
        public auth: AuthService,
        private workService: WorkPageService,
        public workQuery: WorkPageQuery,
        public sessionQuery: SessionQuery,
    ) {}

    ngOnInit(): void {
        if (this.content.kind === 'ProseContent') {
            this.contentUrl = ['/prose', this.content._id, slugify(this.content.title)];
        } else if (this.content.kind === 'PoetryContent') {
            this.contentUrl = ['/poetry', this.content._id, slugify(this.content.title)];
        }
        
        setTwoPartTitle(this.content.title);
    }

    toggleMoreMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    openEditModal() {
        const formData: WorkFormData = {
            kind: this.content.kind,
            content: this.content,
        };
        console.log(this.content);
        this.dialog.open(WorkFormComponent, {
            data: formData,
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
    }

    submitToQueue() {
        this.workService.publish(this.content._id).subscribe();
    }

    addToLibrary() {
        this.loadingLibrary = true;
        this.workService.addToLibrary(this.content._id).subscribe(() => {
            this.loadingLibrary = false;
        });
    }

    removeFromLibrary() {
        this.loadingLibrary = true;
        this.workService.removeFromLibrary(this.content._id).subscribe(() => {
            this.loadingLibrary = false;
        });
    }

    shareContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    reportContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    uploadCoverArt(id: string, kind: ContentKind) {
        this.dialog.open(UploadCoverArtComponent, {
            data: { kind: kind, contentId: id },
            width: '100vw',
            height: '100vh',
            disableClose: true
        });
    }
}

