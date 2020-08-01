import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import  * as multer from 'multer';

import { ImagesService } from './images.service';
import { AuthGuard } from 'src/guards';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class ImagesController {

    constructor(private readonly imagesService: ImagesService) { }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post('upload')
    async upload(@UploadedFile() imageFile: Express.Multer.File, @Req() req: any) {
        await this.imagesService.upload(imageFile, req.user.sub);
    }
}
