import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ImagesService } from './images.service';


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],  
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule { }
