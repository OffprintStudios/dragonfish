import { Module } from '@nestjs/common';
import { ContentFoldersService } from './content-folders.service';

@Module({
  providers: [ContentFoldersService]
})
export class ContentFoldersModule {}
