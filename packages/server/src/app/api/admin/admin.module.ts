import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AdminController } from './admin.controller';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { StatsController } from './stats/stats.controller';
import { UsersModule } from '../../db/users/users.module';
import { WorksModule } from '../../db/works/works.module';

@Module({
  imports: [
    UsersModule,
    WorksModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [StatsController, AdminController]
})
export class AdminModule {}
