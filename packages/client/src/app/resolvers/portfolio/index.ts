import { BlogsResolver } from './blogs.resolver';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionsResolver } from './collections.resolver';
import { HistoryResolver } from './history.resolver';
import { WorksResolver } from './works.resolver';

export const PortfolioResolvers = [
    BlogsResolver,
    CollectionPageResolver,
    CollectionsResolver,
    HistoryResolver,
    WorksResolver,
];
