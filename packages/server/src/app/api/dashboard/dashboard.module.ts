import { Module } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { NewsController } from './news/news.controller';
import { NewsModule } from '../../db/news';

@Module({
  imports: [NewsModule],
  controllers: [NewsController],
  providers: [DashboardService]
})
export class DashboardModule {}
