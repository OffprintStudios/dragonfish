export { PortfolioResolver } from './portfolio.resolver';
export { BlogsResolver } from './blogs.resolver';
export { CollectionPageResolver } from './collection-page.resolver';
export { CollectionsResolver } from './collections.resolver';
export { WorksResolver } from './works.resolver';

import { PortfolioResolver } from './portfolio.resolver';
import { BlogsResolver } from './blogs.resolver';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionsResolver } from './collections.resolver';
import { WorksResolver } from './works.resolver';

export const PortfolioResolvers = [
    PortfolioResolver,
    BlogsResolver,
    CollectionPageResolver,
    CollectionsResolver,
    WorksResolver,
];
