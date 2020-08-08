import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from 'src/app/services/auth';
import { AlertsService } from 'src/app/modules/alerts';
import { ImageCroppedEvent, Dimensions } from 'ngx-image-cropper';
import { HttpError } from 'src/app/models/site';
import { User } from 'src/app/models/users';
import { WorksService } from 'src/app/services/content';
import { Work } from 'src/app/models/works';

@Component({
  selector: 'app-upload-coverart',
  templateUrl: './upload-coverart.component.html',
  styleUrls: ['./upload-coverart.component.less']
})
export class UploadCoverartComponent implements OnInit {
  close: any; // required by Toppy
  workId: string;

  currentUser: User;

  imageChangedEvent: Event;
  croppedImage: any = '';

  fileToReturn: File;

  showCropper = false;
  
  uploading = false;
  uploader: FileUploader;

  constructor(private authService: AuthService, private worksService: WorksService, private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.workId = this.worksService.thisWorkId;
    this.uploader = new FileUploader({
      url: `/api/content/works/upload-coverart/${this.workId}`,
      itemAlias: 'coverart'
    });
  }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): File {
    this.croppedImage = event.base64;

    this.fileToReturn = this.base64ToFile(event.base64, 'coverart');

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

  uploadCoverArt() {
    this.uploader.authToken = `Bearer ${this.currentUser.token}`;
    this.uploading = true;
    this.uploader.clearQueue();
    this.uploader.addToQueue([this.fileToReturn]);
    this.worksService.changeCoverArt(this.uploader).subscribe(
      () => {
        this.uploading = false;
        this.alertsService.success('Cover art uploaded successfully!');
        this.close();
      },
      (error: HttpError) => {
        this.uploading = false;
        this.alertsService.error(`Failed to upload your cover art. ${error.message} (HTTP ${error.statusCode} ${error.error})`);
      },
    );
  }
}
