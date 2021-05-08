import * as Portfolio from '../portfolio.actions';

import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
    @Dispatch()
    public fetchCurrentPortfolio(userId: string) {
        return new Portfolio.FetchCurrentPortfolio(userId);
    }

    @Dispatch()
    public updateCurrentPortfolio(newUserInfo: FrontendUser) {
        return new Portfolio.UpdateCurrentProfile(newUserInfo);
    }

    @Dispatch()
    public watchUser() {
        return new Portfolio.WatchUser();
    }

    @Dispatch()
    public addFriend() {
        return new Portfolio.AddFriend();
    }

    @Dispatch()
    public sendMessage() {
        return new Portfolio.SendMessage();
    }
}
