import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent, Dimensions } from 'ngx-image-cropper';
import { FileUploader } from 'ng2-file-upload';

import { AlertsService } from 'src/app/modules/alerts';
import { AuthService } from 'src/app/services/auth';
import { HttpError } from 'src/app/models/site';
import { User } from 'shared-models';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.less']
})
export class UploadAvatarComponent implements OnInit {
  close: any; // required by Toppy

  currentUser: User;

  imageChangedEvent: Event;
  croppedImage: any = '';

  fileToReturn: File;

  showCropper = false;
  
  uploading = false;
  uploader: FileUploader = new FileUploader({
    url: '/api/auth/upload-avatar',
    itemAlias: 'avatar'
  });

  constructor(private authService: AuthService, private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
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

  cropperReady(sourceImageDimensions: Dimensions): void {
    console.log('Cropper Ready!', sourceImageDimensions);
  }

  loadImageFailed(): void {
    this.alertsService.error(`Seems like we can't load the image. Is something wrong with it?`);
  }

  base64ToFile(data: any, filename: string): File {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  cancel() {
    this.close();
  }

  uploadAvatar() {
    this.uploader.authToken = `Bearer ${this.currentUser.token}`;
    this.uploading = true;
    this.uploader.clearQueue();
    this.uploader.addToQueue([this.fileToReturn]);
    this.authService.changeAvatar(this.uploader).subscribe(
      () => {
        this.uploading = false;
        this.alertsService.success('Avatar uploaded successfully!');
        this.close();
      },
      (error: HttpError) => {
        this.uploading = false;
        this.alertsService.error(`Failed to upload your avatar. ${error.message} (HTTP ${error.statusCode} ${error.error})`);
      },
    );
  }
}
