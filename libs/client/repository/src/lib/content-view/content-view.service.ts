import { Injectable } from '@angular/core';
import { ContentViewStore } from './content-view.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { UserState } from '@dragonfish/client/repository/user';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { ContentKind, SectionInfo } from '@dragonfish/shared/models/content';
import { zip, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContentViewService {
    @SelectSnapshot(UserState.currUser) currUser: FrontendUser;

    constructor(private contentView: ContentViewStore, private network: DragonfishNetworkService) {}

    public fetchContent(contentId: string, kind: ContentKind) {
        const thisContent$ = this.network.fetchContent(contentId, kind);
        let thisRatingsDoc$ = of(null);
        if (this.currUser !== null && this.currUser !== undefined) {
            thisRatingsDoc$ = this.network.addOrFetchRatings(contentId);
        }

        return zip(thisContent$, thisRatingsDoc$).pipe(tap(value => {
            const [content, ratings] = value;
            const contentAny = content as any;
            let sections = null;
            if (content.kind === ContentKind.ProseContent || content.kind === ContentKind.PoetryContent) {
                sections = contentAny.sections as SectionInfo[];
            }
            this.contentView.update({
                currContent: content,
                allSections: sections,
                ratingsDoc: ratings,
                likes: content.stats.likes,
                dislikes: content.stats.dislikes,
            });
        }));
    }
}
