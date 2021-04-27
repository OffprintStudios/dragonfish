import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as Portfolio from './portfolio.actions';
import { PortfolioStateModel } from './portfolio-state.model';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { NetworkService } from '../../services';
import { AlertsService } from '@dragonfish/client/alerts';

@State<PortfolioStateModel>({
    name: 'portfolio',
    defaults: {
        currPortfolio: null
    }
})
@Injectable()
export class PortfolioState {
    @Selector()
    static currPortfolio(ctx: PortfolioStateModel) {
        return ctx.currPortfolio;
    }

    constructor(private network: NetworkService, private alerts: AlertsService) {}

    @Action(Portfolio.FetchCurrentPortfolio)
    public fetchCurrentPortfolio(
        { patchState }: StateContext<PortfolioStateModel>,
        { userId }: Portfolio.FetchCurrentPortfolio,
    ) {
        return this.network.fetchUserInfo(userId).pipe(
            tap((user: FrontendUser) => {
                patchState({
                    currPortfolio: user
                });
            }),
            catchError(err => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(Portfolio.WatchUser)
    public watchUser() {
        this.alerts.info(`This feature is not yet available!`);
    }

    @Action(Portfolio.AddFriend)
    public addFriend() {
        this.alerts.info(`This feature is not yet available!`);
    }

    @Action(Portfolio.SendMessage)
    public sendMessage() {
        this.alerts.info(`This feature is not yet available!`);
    }
}
