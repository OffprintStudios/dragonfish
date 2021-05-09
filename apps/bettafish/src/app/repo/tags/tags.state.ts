import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { patch, updateItem, removeItem } from '@ngxs/store/operators';
import { AlertsService } from '@dragonfish/client/alerts';
import { Collection } from '@dragonfish/shared/models/collections';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NetworkService } from '../../services';
import { TagsStateModel } from './tags-state.model';
import { Tag, TagsForm } from '@dragonfish/shared/models/tags';
import * as Tags from './tags.actions';

@State<TagsStateModel>({
    name: 'tags',
    defaults: {
        tags: [],
        loading: false,
        currTag: null,
    },
})
@Injectable()
export class TagsState {
    constructor(private network: NetworkService, private alerts: AlertsService) {}

    @Action(Tags.Create)
    public create({ getState, patchState }: StateContext<TagsStateModel>, { formInfo }: Tags.Create) {
        return this.network.createTag(formInfo).pipe(
            tap((tag: Tag) => {
                this.alerts.success(`Collection created!`);
                patchState({
                    tags: [...getState().tags, tag],
                });
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }
}
