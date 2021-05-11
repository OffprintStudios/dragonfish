import { ContentKind, SectionInfo, SetRating } from '@dragonfish/shared/models/content';

export class FetchOne {
    static readonly type = '[Content] Fetch One';
    constructor(public contentId: string, public kind: ContentKind) {}
}

export class FetchAll {
    static readonly type = '[Content] Fetch All';
    constructor(public pageNum: number, public kinds: ContentKind[], public userId?: string) {}
}

export class SetSections {
    static readonly type = '[Content] Set Sections';
    constructor(public sections: SectionInfo[]) {}
}

export class FetchSection {
    static readonly type = '[Content] Fetch Section';
    constructor(public sectionId: string) {}
}

export class SetLike {
    static readonly type = '[Content] Set Like';
    constructor(public setRating: SetRating) {}
}

export class SetDislike {
    static readonly type = '[Content] Set Dislike';
    constructor(public setRating: SetRating) {}
}

export class SetNoVote {
    static readonly type = '[Content] Set No Vote';
    constructor(public setRating: SetRating) {}
}

export class IncrementLikes {
    static readonly type = '[Content] Increment Likes';
}

export class DecrementLikes {
    static readonly type = '[Content] Decrement Likes';
}

export class IncrementDislikes {
    static readonly type = '[Content] Increment Dislikes';
}

export class DecrementDislikes {
    static readonly type = '[Content] Decrement Dislikes';
}
