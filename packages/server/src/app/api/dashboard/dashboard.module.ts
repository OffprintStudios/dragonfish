import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DashboardService } from './dashboard.service';
import { NewsController } from './news/news.controller';
import { NewsModule } from '../../db/news';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { UsersModule } from '../../db/users/users.module';

@Module({
  imports: [
    NewsModule, UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [NewsController],
  providers: [DashboardService]
})
export class DashboardModule {}
