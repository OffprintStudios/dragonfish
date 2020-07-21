import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { extname } from 'path';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/db/users/users.module';

const s3 = new AWS.S3({
  endpoint: process.env.DIGITALOCEAN_SPACES_ENDPOINT,
  accessKeyId: process.env.DIGITALOCEAN_SPACES_ACCESS_KEY,
  secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET
});

@Module({
  imports: [
    UsersModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multerS3({
          s3: s3,
          bucket: process.env.DIGITALOCEAN_SPACES_NAME,
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function(req, file, cb) {
            cb(null, file.fieldname + Date.now().toString())
          },
        }),
        fileFilter: function (req, file, cb) {
          let ext = extname(file.originalname);
          if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed!'), false);
          } else {
            return cb(null, true);
          }
        },
        limits: {
          fileSize: 1024 * 1024
        }
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'},
      }),
    }),
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController]
})
export class AuthModule {}
