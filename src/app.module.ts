import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppRoutingModule } from './app-routing.module';

@Module({
  imports: [
    AppRoutingModule, ServeStaticModule.forRoot({rootPath: join(__dirname, './static')}),
  ],
})
export class AppModule {}
