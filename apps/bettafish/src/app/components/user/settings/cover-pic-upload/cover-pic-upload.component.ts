import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AlertsService } from '@dragonfish/client/alerts';
import { AuthState } from '@dragonfish/client/repository/auth';
import { FileUploader } from 'ng2-file-upload';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserService } from '@dragonfish/client/repository/user/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-cover-pic-upload',
    templateUrl: './cover-pic-upload.component.html',
    styleUrls: ['./cover-pic-upload.component.scss'],
})
export class CoverPicUploadComponent implements OnInit {
    @Select(AuthState.token) token$: Observable<string>;
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
        private store: Store,
    ) {}

    ngOnInit() {
        this.token$.pipe(untilDestroyed(this)).subscribe(value => {
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
            this.user.uploadCoverPic(this.uploader);
            this.dialogRef.close();
        } else {
            this.alerts.error(`Only images are allowed.`);
            return;
        }
    }
}
