import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { createInitialState, PortfolioState } from './portfolio.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'portfolio' })
export class PortfolioStore extends Store<PortfolioState> {
    constructor() {
        super(createInitialState());
    }
}
