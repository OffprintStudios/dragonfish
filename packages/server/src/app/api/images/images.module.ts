import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ImagesService } from './images.service';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    providers: [ImagesService],
    exports: [ImagesService],
})
export class ImagesModule {}
