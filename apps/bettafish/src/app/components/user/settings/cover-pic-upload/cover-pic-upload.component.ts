import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { FileUploader } from 'ng2-file-upload';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@dragonfish/client/repository/session/services';
import { SessionQuery } from '@dragonfish/client/repository/session';

@UntilDestroy()
@Component({
    selector: 'dragonfish-cover-pic-upload',
    templateUrl: './cover-pic-upload.component.html',
    styleUrls: ['./cover-pic-upload.component.scss'],
})
export class CoverPicUploadComponent implements OnInit {
    token: string;
    fileToReturn: File;
    showCropper = false;
    uploader: FileUploader = new FileUploader({
        url: '/api/user/upload-cover',
        itemAlias: 'coverPic',
        headers: []
    });

    constructor(
        private dialogRef: MatDialogRef<CoverPicUploadComponent>,
        private alerts: AlertsService,
        private user: UserService,
        private sessionQuery: SessionQuery,
    ) {}

    ngOnInit() {
        this.sessionQuery.token$.pipe(untilDestroyed(this)).subscribe(value => {
            this.token = value;
        });
    }

    fileDropped(event: File[]): void {
        if (event.length > 1) {
            this.alerts.error(`You can't upload more than one thing!`);
            return;
        }

        if (event[0] && (event[0].type === 'image/png' || event[0].type === 'image/jpg' || event[0].type === 'image/jpeg')) {
            this.uploader.authToken = `Bearer ${this.token}`;
            this.uploader.clearQueue();
            this.uploader.addToQueue([event[0]]);
            this.user.changeProfileCover(this.uploader).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.alerts.error(`Only images are allowed.`);
            return;
        }
    }
}
