import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { patch, updateItem, removeItem } from '@ngxs/store/operators';
import { AlertsService } from '@dragonfish/client/alerts';
import { Collection } from '@dragonfish/shared/models/collections';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CollectionsStateModel } from './collections-state.model';
import { NetworkService } from '../../services';
import * as Collections from './collections.actions';

@State<CollectionsStateModel>({
    name: 'collections',
    defaults: {
        collections: [],
        loading: false,
        currCollection: null,
    },
})
@Injectable()
export class CollectionsState {
    @Selector()
    static collections(ctx: CollectionsStateModel) {
        return ctx.collections;
    }

    @Selector()
    static loading(ctx: CollectionsStateModel) {
        return ctx.loading;
    }

    @Selector()
    static currCollection(ctx: CollectionsStateModel) {
        return ctx.currCollection;
    }

    constructor(private network: NetworkService, private alerts: AlertsService) {}

    @Action(Collections.Create)
    public create({ getState, patchState }: StateContext<CollectionsStateModel>, { formInfo }: Collections.Create) {
        return this.network.createCollection(formInfo).pipe(
            tap((collection: Collection) => {
                this.alerts.success(`Collection created!`);
                patchState({
                    collections: [...getState().collections, collection],
                });
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(Collections.Edit)
    public edit({ setState }: StateContext<CollectionsStateModel>, { id, formInfo }: Collections.Edit) {
        return this.network.editCollection(id, formInfo).pipe(
            tap((result: Collection) => {
                this.alerts.success(`Changed saved!`);
                setState(
                    patch({
                        collections: updateItem<Collection>((coll) => coll._id === result._id, result),
                        currCollection: result,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(Collections.Delete)
    public delete({ setState }: StateContext<CollectionsStateModel>, { id }: Collections.Edit) {
        return this.network.deleteCollection(id).pipe(
            tap((result: void) => {
                this.alerts.success(`Collection deleted!`);
                setState(
                    patch({
                        collections: removeItem<Collection>((coll) => coll._id === id),
                        currCollection: null,
                    }),
                );
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    @Action(Collections.SetVisibility)
    public setVisibility() {
        this.alerts.info(`Whoops! This feature isn't implemented yet.`);
    }

    @Action(Collections.SetCurrent)
    public setCurrent({ patchState }: StateContext<CollectionsStateModel>, { current }: Collections.SetCurrent) {
        patchState({
            currCollection: current,
        });
    }

    @Action(Collections.FetchAll)
    public fetchAll({ patchState }: StateContext<CollectionsStateModel>) {
        patchState({
            loading: true,
        });

        return this.network.fetchAllCollectionsNoPaginate().pipe(
            tap((result: Collection[]) => {
                patchState({
                    collections: result,
                    loading: false,
                });
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                patchState({
                    loading: false,
                });
                return throwError(err);
            }),
        );
    }

    @Action(Collections.AddContent)
    public addContent() {
        this.alerts.info(`Whoops! This feature isn't implemented yet.`);
    }

    @Action(Collections.RemoveContent)
    public removeContent() {
        this.alerts.info(`Whoops! This feature isn't implemented yet.`);
    }
}
