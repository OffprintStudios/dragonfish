import * as Portfolio from './portfolio.actions';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';

import { AlertsService } from '@dragonfish/client/alerts';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PortfolioStateModel } from './portfolio-state.model';
import { throwError } from 'rxjs';

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

    constructor(private network: DragonfishNetworkService, private alerts: AlertsService) {}

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

    @Action(Portfolio.UpdateCurrentProfile)
    public updateCurrentProfile(
        { patchState }: StateContext<PortfolioStateModel>,
        { newUserInfo }: Portfolio.UpdateCurrentProfile
    ) {
        patchState({
            currPortfolio: newUserInfo,
        });
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
