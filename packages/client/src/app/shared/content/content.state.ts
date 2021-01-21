import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Content } from './content.actions';
import { ContentStateModel } from './content-state.model';
import { ContentService } from './services';
import { ContentModel } from '@pulp-fiction/models/content';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';

@State<ContentStateModel>({
    name: 'content',
    defaults: {
        currContent: null,
        currHistDoc: null
    }
})
@Injectable()
export class ContentState {
    constructor (private contentService: ContentService, private snackBar: MatSnackBar) {}

    /* Actions */

    @Action(Content.FetchOne)
    fetchOne() {

    }

    @Action(Content.FetchAll)
    fetchAll() {

    }

    @Action(Content.FetchSection)
    fetchSection() {

    }

    @Action(Content.SetLike)
    setLike() {

    }

    @Action(Content.SetDislike)
    setDislike() {

    }

    @Action(Content.SetNoVote)
    setNoVote() {

    }

    /* Selectors */

    @Selector()
    static currContent(state: ContentStateModel): ContentModel {
        return state.currContent;
    }

    @Selector()
    static currHistDoc(state: ContentStateModel): ReadingHistory {
        return state.currHistDoc;
    }
}