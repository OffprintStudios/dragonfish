import {
    ContentKind,
    ContentModel,
    Genres,
    PoetryForm,
    PubStatus,
    WorkStatus,
} from '@dragonfish/shared/models/content';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadCoverArtComponent } from '../upload-cover-art/upload-cover-art.component';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent {
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    pubStatus = PubStatus;
    addEditIcon = false;

    constructor(
        private dialog: MatDialog,
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private router: Router,
        private alerts: AlertsService
    ) {}

    uploadCoverArt(contentId: string, kind: ContentKind) {
        this.dialog.open(UploadCoverArtComponent, { data: { kind: kind, contentId: contentId } });
    }

    goBack() {
        this.router.navigate(['/my-stuff']);
    }

    /**
     * Sends a request to publish the specified content given its info.
     *
     * @param content The content to publish
     */
    publish(content: ContentModel) {
        if (content.audit.published === PubStatus.Unpublished) {
            if (content.kind === ContentKind.ProseContent && content.stats.words < 750) {
                this.alerts.warn(`Prose needs a minimum of 750 published words in order to be submitted!`);
                return;
            }

            this.stuff.publish(content._id).subscribe();
        }
    }

    /**
     * Asks if a user really wants to delete the specified content. If yes,
     * sends a request to delete the specified content given its ID. If no,
     * does nothing.
     */
    deleteContent(content: ContentModel) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.stuff.delete(content._id).subscribe(() => {
                    this.router.navigate(['/my-stuff']);
                });
            }
        });
    }
}
