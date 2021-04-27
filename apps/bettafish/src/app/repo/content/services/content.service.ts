import { Injectable } from '@angular/core';
import { ContentKind, SectionInfo, SetRating } from '@dragonfish/shared/models/content';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as Content from '../content.actions';

@Injectable({ providedIn: 'root' })
export class ContentService {
    @Dispatch()
    public fetchOne(contentId: string, kind: ContentKind) {
        return new Content.FetchOne(contentId, kind);
    }

    @Dispatch()
    public fetchAll(pageNum: number, kinds: ContentKind[], userId?: string) {
        return new Content.FetchAll(pageNum, kinds, userId);
    }

    @Dispatch()
    public setSections(sections: SectionInfo[]) {
        return new Content.SetSections(sections);
    }

    @Dispatch()
    public fetchSection(sectionId: string) {
        return new Content.FetchSection(sectionId);
    }

    @Dispatch()
    public setLike(setRating: SetRating) {
        return new Content.SetLike(setRating);
    }

    @Dispatch()
    public setDislike(setRating: SetRating) {
        return new Content.SetDislike(setRating);
    }

    @Dispatch()
    public setNoVote(setRating: SetRating) {
        return new Content.SetNoVote(setRating);
    }

    @Dispatch()
    public incrementLikes() {
        return new Content.IncrementLikes();
    }

    @Dispatch()
    public decrementLikes() {
        return new Content.DecrementLikes();
    }

    @Dispatch()
    public incrementDislikes() {
        return new Content.IncrementDislikes();
    }

    @Dispatch()
    public decrementDislikes() {
        return new Content.DecrementDislikes();
    }
}
