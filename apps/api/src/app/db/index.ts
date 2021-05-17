import { ApprovalQueueModule } from './approval-queue/approval-queue.module';
import { CollectionsModule } from './collections/collections.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OldBlogsModule } from './blogs/blogs.module';
import { SectionsModule } from './sections/sections.module';
import { UsersModule } from './users/users.module';
import { WorksModule } from './works/works.module';

export const DatabaseModules = [
    UsersModule,
    CollectionsModule,
    MessagesModule,
    NotificationsModule,
    SectionsModule,
    ApprovalQueueModule,
    CommentsModule,
    WorksModule,
    OldBlogsModule,
];
