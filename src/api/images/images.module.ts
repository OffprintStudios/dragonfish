import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ImagesService } from './images.service';


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '10800s' }, // 3 hours, temporary until problems with auth tokens fixed.
      }),
    }),
  ],  
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule { }
