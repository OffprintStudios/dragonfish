import { PortfolioComponent } from './portfolio.component';
import { PortfolioHomePages } from './port-home';
import { PortfolioWorksPages } from './works';
import { PortfolioBlogPages } from './blogs';
import { PortfolioCollectionsPages } from './collections';
import { PortfolioHistoryPages } from './history';
import { PortfolioConversationsPages } from './conversations';
import { PortfolioSettingsPages } from './settings';

export const PortfolioPages = [
    PortfolioComponent,
    ...PortfolioHomePages,
    ...PortfolioWorksPages,
    ...PortfolioBlogPages,
    ...PortfolioCollectionsPages,
    ...PortfolioHistoryPages,
    ...PortfolioConversationsPages,
    ...PortfolioSettingsPages,
];
