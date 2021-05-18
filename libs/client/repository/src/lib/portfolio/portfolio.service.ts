import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PortfolioStore } from './portfolio.store';
import { PortfolioQuery } from './portfolio.query';
import { catchError, tap } from 'rxjs/operators';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
    constructor(
        private portfolioStore: PortfolioStore,
        private portfolioQuery: PortfolioQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    /**
     * Fetches a user's portfolio.
     * @param userId
     */
    public fetchPortfolio(userId: string) {
        return this.network.fetchUserInfo(userId).pipe(
            tap((user: FrontendUser) => {
                this.portfolioStore.update({
                    currPortfolio: user,
                });
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    /**
     * Updates the current portfolio with the current user.
     * @param user
     */
    public updatePortfolio(user: FrontendUser) {
        this.portfolioStore.update({
            currPortfolio: user,
        });
    }
}
