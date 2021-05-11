import { UsersModule } from './users/users.module';
import { ContentModule } from './content';
import { ReadingHistoryModule } from './reading-history/reading-history.module';
import { CollectionsModule } from './collections/collections.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SectionsModule } from './sections/sections.module';
import { ApprovalQueueModule } from './approval-queue/approval-queue.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings';
import { WorksModule } from './works/works.module';
import { OldBlogsModule } from './blogs/blogs.module';

export const DatabaseModules = [
    UsersModule,
    ContentModule,
    ReadingHistoryModule,
    CollectionsModule,
    MessagesModule,
    NotificationsModule,
    SectionsModule,
    ApprovalQueueModule,
    CommentsModule,
    RatingsModule,
    WorksModule,
    OldBlogsModule,
];
