import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../../db/users/users.module';
import { OldBlogsModule } from '../../db/blogs/blogs.module';
import { WorksModule } from '../../db/works/works.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { ContentModule } from '../../db/content';
import { MigrationService } from './migration.service';
import { MigrationController } from './migration.controller';

@Module({
    imports: [
        UsersModule,
        OldBlogsModule,
        WorksModule,
        ContentModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    providers: [MigrationService],
    controllers: [MigrationController],
})
export class MigrationModule {}
