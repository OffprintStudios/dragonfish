export { PortfolioResolver } from './portfolio.resolver';
export { CollectionPageResolver } from './collection-page.resolver';
export { CollectionsResolver } from './collections.resolver';

import { PortfolioResolver } from './portfolio.resolver';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionsResolver } from './collections.resolver';

export const PortfolioResolvers = [
    PortfolioResolver,
    CollectionPageResolver,
    CollectionsResolver,
];
