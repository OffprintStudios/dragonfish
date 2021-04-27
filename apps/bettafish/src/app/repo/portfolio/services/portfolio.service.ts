import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as Portfolio from '../portfolio.actions';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
    @Dispatch()
    public fetchCurrentPortfolio(userId: string) {
        return new Portfolio.FetchCurrentPortfolio(userId);
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
