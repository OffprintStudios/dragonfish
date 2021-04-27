export interface IImages {
    /**
     * Uploads the given form-data for the user with the given ID. On success,
     * returns the full URL of the uploaded image.
     *
     * @throws(BadRequestException) if the image is larger than 3MB, or is not a PNG or JPEG.
     * @throws(InternalServerException) if the upload to Spaces fails.
     * @returns The full URL of the uploaded image.
     */
    upload(imageFile: any, userId: string, folder: string): Promise<string>;
}
