import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';

const ONE_MEGABYTE: number = 1024 * 1024;
const JPEG_MIME_TYPE = 'image/jpeg';
const PNG_MIME_TYPE = 'image/png';

@Injectable()
export class ImagesService {

    private readonly s3 = new AWS.S3({
        endpoint: process.env.DIGITALOCEAN_SPACES_ENDPOINT,
        accessKeyId: process.env.DIGITALOCEAN_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET,
    });

    /**
     * Uploads the given form-data for the user with the given ID. On success,
     * returns the full URL of the uploaded image.
     * @throws(BadRequestException) if the image is larger than 3MB, or is not a PNG or JPEG.
     * @throws(InternalServerException) if the upload to Spaces fails.
     * @returns The full URL of the uploaded image. 
     */
    async upload(imageFile: any, userId: string, folder: string): Promise<string> {
        this.validateImageFile(imageFile);

        const extension = this.getExtension(imageFile);

        const uploadOptions: AWS.S3.PutObjectRequest = {
            Bucket: `${process.env.DIGITALOCEAN_SPACES_NAME}/${folder}`,
            Key: `${userId}-${uuidV4()}.${extension}`, // Note: Keys must be unique per-Space
            Body: imageFile.buffer,
            ACL: 'public-read',
            ContentType: imageFile.mimetype,
        };

        return new Promise((resolve) => {
            this.s3.upload(uploadOptions, null, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    throw new InternalServerErrorException(err);
                }

                if (!data?.Location) {
                    throw new InternalServerErrorException(null, "Image upload did not return a URL.");
                }

                resolve(data.Location);
            })
        });
    }

    private validateImageFile(file: any): void {
        // For the future: this is a good place to check things like
        // * Is this _actually_ a JPG/PNG        
        // * Are the dimensions ridiculous?
        // * etc.
        if (file.buffer.byteLength > ONE_MEGABYTE * 3) {
            throw new BadRequestException(`Uploaded files must be 3MB or smaller.`)
        }
        
        if (file.mimetype !== JPEG_MIME_TYPE && file.mimetype !== PNG_MIME_TYPE) {
            throw new BadRequestException(`Upload must be either a JPEG or PNG image!`);
        }
    }

    private getExtension(file: any): string {
        if (file.mimetype === JPEG_MIME_TYPE) {
            return "jpg";
        }
        else if (file.mimetype === PNG_MIME_TYPE) {
            return "png";
        }
    }
}
