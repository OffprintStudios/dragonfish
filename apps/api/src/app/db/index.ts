import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { OldBlogsModule } from './blogs/blogs.module';
import { WorksModule } from './works/works.module';

export const DatabaseModules = [
    MessagesModule,
    CommentsModule,
    WorksModule,
    OldBlogsModule,
];
