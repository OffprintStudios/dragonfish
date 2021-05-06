import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { History } from './history.actions';
import { HistoryStateModel } from './history-state.model';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { NetworkService } from '../../services';
import { AlertsService } from '@dragonfish/client/alerts';

@State<HistoryStateModel>({
    name: 'history',
    defaults: {
        history: [],
        selectedDocs: [],
        loading: false,
    },
})
@Injectable()
export class HistoryState {
    @Selector()
    public static history(state: HistoryStateModel) { return state.history; }

    @Selector()
    public static selectedDocs(state: HistoryStateModel) { return state.selectedDocs; }

    @Selector()
    public static loading(state: HistoryStateModel) { return state.loading; }

    constructor(private network: NetworkService, private alerts: AlertsService) {}

    @Action(History.Fetch)
    public fetch({ patchState }: StateContext<HistoryStateModel>) {
        patchState({
            loading: true,
        });
        return this.network.fetchUserHistory().pipe(tap((val: ReadingHistory[]) => {
            patchState({
                history: val,
                loading: false,
            });
        }));
    }

    @Action(History.Select)
    public select({ getState, patchState }: StateContext<HistoryStateModel>, { docId }: History.Select) {
        patchState({
            selectedDocs: [...getState().selectedDocs, docId],
        });
    }

    @Action(History.Delete)
    public delete({ patchState }: StateContext<HistoryStateModel>, { docIds }: History.Delete) {}
}
