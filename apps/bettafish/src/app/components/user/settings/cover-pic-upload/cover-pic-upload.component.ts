import { Component, OnInit } from '@angular/core';

import { AlertsService } from '@dragonfish/client/alerts';
import { FileUploader } from 'ng2-file-upload';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { UserService } from '../../../../repo/user/services';

@Component({
    selector: 'dragonfish-cover-pic-upload',
    templateUrl: './cover-pic-upload.component.html',
    styleUrls: ['./cover-pic-upload.component.scss'],
})
export class CoverPicUploadComponent implements OnInit {
    token: string;
    imageChangedEvent: Event;
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
        private store: Store,
    ) {}

    ngOnInit() {
        const stateSnapshot = this.store.snapshot();
        this.token = stateSnapshot.auth.token;
    }

    fileDropped(event: FileList) {
        if (event.length > 1) {
            this.alerts.error(`You can't upload more than one thing!`);
        }

        if (event[0] && (event[0].type === 'image/png' || event[0].type === 'image/jpg' || event[0].type === 'image/jpeg')) {
            this.uploader.authToken = `Bearer ${this.token}`;
            this.uploader.clearQueue();
            this.uploader.addToQueue([event[0]]);
            this.user.uploadCoverPic(this.uploader);
            this.dialogRef.close();
        } else {
            this.alerts.error(`Only images are allowed.`);
            return;
        }
    }

    cancel() {
        this.dialogRef.close();
    }

    uploadCoverPic() {
        this.uploader.authToken = `Bearer ${this.token}`;
        this.uploader.clearQueue();
        this.uploader.addToQueue([this.fileToReturn]);

        /*this.user.uploadAvatar(this.uploader).then(() => {
            this.uploading = false;
            this.dialogRef.close();
        }).catch(() => {
            this.uploading = false;
        });*/
    }
}
