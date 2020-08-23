import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageCroppedEvent, CropperPosition } from 'ngx-image-cropper';

import { AuthService } from '../../../../services/auth';
import { AlertsService } from '../../../../modules/alerts';
import { HttpError } from '../../../../models/site';
import { WorksService } from '../../../../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-upload-coverart',
  templateUrl: './upload-coverart.component.html',
  styleUrls: ['./upload-coverart.component.less']
})
export class UploadCoverartComponent implements OnInit {
  close: any; // required by Toppy
  workId: string;

  currentUser: FrontendUser;

  imageChangedEvent: Event;
  croppedImage: any = '';

  fileToReturn: File;
  
  showCropper = false;  
  cropperDimensions: CropperPosition = {
    x1: 0, x2: 0, y1: 0, y2: 0
  };
  
  loading = false;
  uploader: FileUploader;

  /** Flag that is set to true when an image is selected,
   * then cleared back to false when cropped for the first time
   * by the autoCrop function.
   */
  newImageAdded: boolean = true;

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

  fileChangeEvent(fileInput: Event): void { 
    this.loading = true;
    const inputElement = fileInput.target as HTMLInputElement;
    if (inputElement.files.length === 0) {
      return;
    }

    this.setFileFormat(inputElement.files[0])
      .then(() => {
        this.loading = false;
        this.imageChangedEvent = fileInput;    
        this.newImageAdded = true;
      },
      (rejectedReason: any) => {
        this.loading = false;
      });    
  }

  async setFileFormat(imageFile: File): Promise<void> {
    const uploadedImageFormat = await this.readFileFormat(imageFile);
    if (!uploadedImageFormat) {
      this.loadImageFailed();  
      throw new Error("Unsupported image format.");
    }    
  }

  imageCropped(event: ImageCroppedEvent): File {
    // If this is a newly-selected file, snap the cropper to the image borders    
    if (this.newImageAdded) {
      this.newImageAdded = false;

      // Get the value that allows us to convert between image size and cropper coordinates
      if (event.height >= event.cropperPosition.y2 && event.width >= event.cropperPosition.x2) {
        // ...but only if the image is actually larger than the cropper coordinates.
        this.snapCropperToBorders(event);
      }
    }

    this.croppedImage = event.base64;
    this.fileToReturn = this.base64ToFile(event.base64, 'coverart');   
    console.log(`Cropped file is ${((event.base64.length * 6) / 8).toLocaleString()} bytes.`);
    return this.fileToReturn;
  }

  imageLoaded(): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    this.alertsService.error(`Seems like we can't load the image. Is something wrong with it? We only support PNG, JPEG and GIF.`);
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
    this.loading = true;
    this.uploader.clearQueue();
    this.uploader.addToQueue([this.fileToReturn]);
    this.worksService.changeCoverArt(this.uploader).subscribe(
      () => {
        this.loading = false;
        this.alertsService.success('Cover art uploaded successfully!');
        this.close();
      },
      (error: HttpError) => {
        this.loading = false;        
        this.alertsService.error(`Failed to upload your cover art. ${error.message} (HTTP ${error.statusCode} ${error.error})`);
      },
    );
  }

  snapCropperToBorders(event: ImageCroppedEvent): void {     
    // Calculate the conversion factor between cropper coordinates and
    // image sizes
    const heightFactor = event.cropperPosition.y2 / event.height;
    const widthFactor = event.cropperPosition.x2 / event.width;

    let widthAdjustment = 0;
    let heightAdjustment = 0;

    if (event.offsetImagePosition.x1 < 0) {
      widthAdjustment =  -event.offsetImagePosition.x1 * widthFactor;
    }

    if (event.offsetImagePosition.y1 < 0) {
      heightAdjustment = -event.offsetImagePosition.y1 * heightFactor;
    }

    // When cropper exceeds the bounds of an image, we 
    // get offsetImagePosition dimeions like:
    // x1: -20, x2: 70, y1:  0, y2: 100
    // on an image with dimenions like 50 x 100.
    // So we just need to move BOTH x values toward zero.
    // That means addition for the negative value, and subtraction
    // for the positive value.
    this.cropperDimensions = {
      x1: event.cropperPosition.x1 + widthAdjustment,
      x2: event.cropperPosition.x2 - widthAdjustment,
      y1: event.cropperPosition.y1 + heightAdjustment,
      y2: event.cropperPosition.y2 - heightAdjustment
    };
  }

  async readFileFormat(imageFile: File): Promise<string | null> {    
    let firstFourBytes: Uint8Array = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
        resolve(new Uint8Array((e.target.result as ArrayBuffer)).subarray(0, 4));
      };
      fileReader.onabort = err => reject(err);
      fileReader.onerror = err => reject(err); 
      
      fileReader.readAsArrayBuffer(imageFile);
    });

    // Read the bytes out as hex into a string
    let header = "";
    for (let i = 0; i < firstFourBytes.length; i++) {
      header += firstFourBytes[i].toString(16);
    }

    switch (header) {
      // PNG
      case "89504e47":
        return "png";          

      // GIF
      case "47494638":
        return "gif"; // coerce GIFs to PNGs

      // All JPEG
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
      case "ffd8ffe3":
      case "ffd8ffe8":
        return "jpeg";          
      default:        
        return null;
    }
  }
}
