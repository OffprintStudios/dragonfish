import { Component, OnInit } from '@angular/core';

import { AlertsService } from '@dragonfish/client/alerts';
import { FileUploader } from 'ng2-file-upload';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { UserService } from '@dragonfish/client/repository/user/services';

@Component({
    selector: 'dragonfish-upload-avatar',
    templateUrl: './upload-avatar.component.html',
    styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
    token: string;
    imageChangedEvent: Event;
    croppedImage: any = '';

    fileToReturn: File;

    showCropper = false;

    uploading = false;
    uploader: FileUploader = new FileUploader({
        url: '/api/user/upload-avatar',
        itemAlias: 'avatar',
        headers: []
    });

    constructor(
        private dialogRef: MatDialogRef<UploadAvatarComponent>,
        private alerts: AlertsService,
        private user: UserService,
        private store: Store,
    ) {}

    ngOnInit() {
        const stateSnapshot = this.store.snapshot();
        this.token = stateSnapshot.auth.token;
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent): File {
        this.croppedImage = event.base64;

        this.fileToReturn = this.base64ToFile(event.base64, 'avatar');

        console.log(this.fileToReturn);
        return this.fileToReturn;
    }

    imageLoaded(): void {
        this.showCropper = true;
    }

    loadImageFailed(): void {
        this.alerts.warn(`Uh-oh! Seems like we can't load the image. Is something wrong with it?`);
    }

    base64ToFile(data: any, filename: string): File {
        const arr = data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    cancel() {
        this.dialogRef.close();
    }

    uploadAvatar() {
        this.uploader.authToken = `Bearer ${this.token}`;
        this.uploading = true;
        this.uploader.clearQueue();
        this.uploader.addToQueue([this.fileToReturn]);

        this.user.uploadAvatar(this.uploader).then(() => {
            this.uploading = false;
            this.dialogRef.close();
        }).catch(() => {
            this.uploading = false;
        });
    }
}
