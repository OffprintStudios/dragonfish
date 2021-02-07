import { MigrationController } from './migration.controller';
import { OldBlogsController } from './old-blogs.controller';
import { OldWorksController } from './old-works.controller';

export const MigrationRoutes = [MigrationController, OldBlogsController, OldWorksController];
