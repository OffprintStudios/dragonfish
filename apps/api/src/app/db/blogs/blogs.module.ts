import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogsSchema } from './blogs.schema';
import { OldBlogsService } from './blogs.service';
import { UsersModule } from '@dragonfish/api/database/users';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogsSchema }]), UsersModule],
    providers: [OldBlogsService],
    exports: [OldBlogsService],
})
export class OldBlogsModule {}
