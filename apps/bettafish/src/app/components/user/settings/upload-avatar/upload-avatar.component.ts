import { Component, OnInit } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';
import { FileUploader } from 'ng2-file-upload';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { UserService } from '@dragonfish/client/repository/session/services';
import { untilDestroyed } from '@ngneat/until-destroy';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-upload-avatar',
    templateUrl: './upload-avatar.component.html',
    styleUrls: ['./upload-avatar.component.scss'],
    animations: [
        // the fade-in/fade-out animation.
        trigger('simpleFadeAnimation', [
            // the "in" style determines the "resting" state of the element when it is visible.
            state('in', style({ opacity: 1 })),

            // fade in when created. this could also be written as transition('void => *')
            transition(':enter', [style({ opacity: 0 }), animate(600)]),

            // fade out when destroyed. this could also be written as transition('void => *')
            transition(':leave', animate(600, style({ opacity: 0 }))),
        ]),
    ],
})
export class UploadAvatarComponent implements OnInit {
    token: string;
    imageChangedEvent: any;
    croppedImage: any = '';

    fileToReturn: File;

    showCropper = false;

    uploading = false;
    uploader: FileUploader = new FileUploader({
        url: '/api/user/upload-avatar',
        itemAlias: 'avatar',
        headers: [],
    });

    constructor(
        private dialogRef: MatDialogRef<UploadAvatarComponent>,
        private alerts: AlertsService,
        private user: UserService,
        private sessionQuery: SessionQuery,
    ) {}

    ngOnInit() {
        this.sessionQuery.token$.pipe(untilDestroyed(this)).subscribe((value) => {
            this.token = value;
        });
    }

    fileChangeEvent(event: Event | File[]): void {
        if (isNullOrUndefined(event[0]) !== true) {
            const fileEvent = event as File[];
            if (fileEvent.length > 1) {
                this.alerts.error(`You're only allowed to upload one image!`);
                return;
            }
            this.imageChangedEvent = {
                target: {
                    accept: 'image/png, image/jpeg, image/jpg',
                    files: event as File[],
                },
            };
            this.showCropper = true;
        } else {
            this.imageChangedEvent = event;
            this.showCropper = true;
        }
    }

    imageCropped(event: ImageCroppedEvent): File {
        this.croppedImage = event.base64;
        this.fileToReturn = this.base64ToFile(event.base64, 'avatar');
        return this.fileToReturn;
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

        this.alerts.info(`This feature has been temporarily disabled.`);
        /*this.user.changeAvatar(this.uploader).subscribe(
            () => {
                this.uploading = false;
                this.dialogRef.close();
            },
            () => {
                this.uploading = false;
            },
        );*/
    }
}
