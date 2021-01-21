import { ContentKind, SetRating } from "@pulp-fiction/models/content";

export namespace Content {
    export class FetchOne {
        static readonly type = '[Content] FetchOne';
        constructor (public contentId: string, public kind: ContentKind) {}
    }

    export class FetchAll {
        static readonly type = '[Content] FetchAll';
        constructor (public pageNum: number, public kinds: ContentKind[], public userId?: string) {}
    }

    export class SetPubSections {
        static readonly type = '[Content] SetPubSections';
        constructor () {}
    }

    export class FetchSection {
        static readonly type = '[Content] FetchSection';
        constructor (public sectionId: string) {}
    }

    export class SetLike {
        static readonly type = '[Content] SetLike';
        constructor (public setRating: SetRating) {}
    }

    export class SetDislike {
        static readonly type = '[Content] SetDislike';
        constructor (public setRating: SetRating) {}
    }

    export class SetNoVote {
        static readonly type = '[Content] SetNoVote';
        constructor (public setRating: SetRating) {}
    }
}