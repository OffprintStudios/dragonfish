import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface PortfolioState {
    currPortfolio: Pseudonym | null;
}

export function createInitialState(): PortfolioState {
    return {
        currPortfolio: null,
    };
}
