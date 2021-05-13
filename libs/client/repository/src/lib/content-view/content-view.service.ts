import { Injectable } from '@angular/core';
import { ContentViewStore } from './content-view.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { UserState } from '@dragonfish/client/repository/user';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { ContentKind } from '@dragonfish/shared/models/content';
import { zip } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContentViewService {
    @SelectSnapshot(UserState.currUser) currUser: FrontendUser;

    constructor(private contentView: ContentViewStore, private network: DragonfishNetworkService) {}

    public fetchContent(contentId: string, kind: ContentKind) {
        const thisContent$ = this.network.fetchContent(contentId, kind);
        const thisRatingDoc$ = this.network.fetchRatings(contentId);
        let thisHistDoc$ = null;
        if (this.currUser !== null && this.currUser !== undefined) {
            thisHistDoc$ = this.network.fetchRelatedHistory(contentId);
        }

        return zip(thisContent$, thisRatingDoc$, thisHistDoc$).pipe(tap(value => {
            const [content, ratings] = value;
            this.contentView.update({
                currContent: content,
                likes: ratings.likes,
                dislikes: ratings.dislikes,
            })
        }));
    }
}
