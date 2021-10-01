import { Component, Input, OnInit } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind, Genres, TagKind } from '@dragonfish/shared/models/content';
import { UploadCoverArtComponent } from '../upload-cover-art/upload-cover-art.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { slugify } from 'voca';

@Component({
    selector: 'dragonfish-work-banner',
    templateUrl: './work-banner.component.html',
    styleUrls: ['./work-banner.component.scss'],
})
export class WorkBannerComponent implements OnInit {
    @Input() content;
    contentUrl = [];
    moreMenuOpened = false;
    addEditIcon = false;
    tagKind = TagKind;
    genres = Genres;

    constructor(private alerts: AlertsService, private dialog: MatDialog, public auth: AuthService) {}

    ngOnInit(): void {
        if (this.content.kind === 'ProseContent') {
            this.contentUrl = ['/prose', this.content._id, slugify(this.content.title)];
        } else if (this.content.kind === 'PoetryContent') {
            this.contentUrl = ['/poetry', this.content._id, slugify(this.content.title)];
        }
    }

    toggleMoreMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    addToLibrary() {
        this.alerts.info(`This feature is not yet available!`);
    }

    shareContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    reportContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    uploadCoverArt(id: string, kind: ContentKind) {
        this.dialog.open(UploadCoverArtComponent, { data: { kind: kind, contentId: id } });
    }
}
