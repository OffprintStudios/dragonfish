import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent, Dimensions } from 'ngx-image-cropper';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { AlertsService } from 'src/app/modules/alerts';
import { AuthService } from 'src/app/services/auth';
import { User } from 'src/app/models/users';
import { HttpError } from 'src/app/models/site';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.less']
})
export class UploadAvatarComponent implements OnInit {
  close: any; // required by Toppy

  currentUser: User;

  imageChangedEvent: any = '';
  croppedImage: any = '';

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

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper Ready!', sourceImageDimensions);
  }

  loadImageFailed() {
    this.alertsService.error(`Seems like we can't load the image. Is something wrong with it?`);
  }

  uploadAvatar() {
    this.uploader.authToken = `Bearer ${this.currentUser.token}`;
    this.uploading = true;
    this.authService.changeAvatar(this.uploader).subscribe(
      () => {
        this.uploading = false;
        this.alertsService.success('Avatar uploaded successfully!');
      },
      (error: HttpError) => {
        this.uploading = false;
        this.alertsService.error(`Failed to upload your avatar. ${error.message} (HTTP ${error.statusCode} ${error.error})`);
      },
    );
  }
}
