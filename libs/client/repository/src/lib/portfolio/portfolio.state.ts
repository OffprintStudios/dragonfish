import { FrontendUser } from '@dragonfish/shared/models/users';

export interface PortfolioState {
    currPortfolio: FrontendUser | null;
}

export function createInitialState(): PortfolioState {
    return {
        currPortfolio: null,
    };
}
