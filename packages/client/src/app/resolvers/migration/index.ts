export { MigrationResolver } from './migration.resolver';
export { MigrateWorkResolver } from './migrate-work.resolver';
export { MigrateBlogResolver } from './migrate-blog.resolver';

import { MigrationResolver } from './migration.resolver';
import { MigrateWorkResolver } from './migrate-work.resolver';
import { MigrateBlogResolver } from './migrate-blog.resolver';

export const MigrationResolvers = [MigrationResolver, MigrateWorkResolver, MigrateBlogResolver];
