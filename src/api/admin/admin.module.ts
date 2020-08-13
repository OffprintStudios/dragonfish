import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { getJwtSecretKey, JWT_EXPIRATION } from 'src/util';
import { StatsController } from './stats/stats.controller';
import { UsersModule } from 'src/db/users/users.module';
import { WorksModule } from 'src/db/works/works.module';

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
  controllers: [StatsController]
})
export class AdminModule {}
