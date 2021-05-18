import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PortfolioState } from './portfolio.state';
import { PortfolioStore } from '@dragonfish/client/repository/portfolio/portfolio.store';

@Injectable({ providedIn: 'root' })
export class PortfolioQuery extends Query<PortfolioState> {
    public portUser$ = this.select('currPortfolio');

    constructor(protected store: PortfolioStore) {
        super(store);
    }

    public get portUserName() {
        return this.getValue().currPortfolio.username;
    }

    public get portUserId() {
        return this.getValue().currPortfolio._id;
    }
}
