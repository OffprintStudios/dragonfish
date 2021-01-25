import { BlogForm, ContentKind, ContentModel, CreatePoetry, CreateProse, NewsForm } from "@pulp-fiction/models/content";

export namespace MyStuff {
    export class SetFiles {
        static readonly type = '[My Stuff] Set Files';
        constructor () {}
    }

    export class CreateContent {
        static readonly type = '[My Stuff] Create Content';
        constructor (public kind: ContentKind, public formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm) {}
    }

    export class SaveContent {
        static readonly type = '[My Stuff] Save Content';
        constructor (public kind: ContentKind, public formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm) {}
    }

    export class UploadCoverArt {
        static readonly type = '[My Stuff] Upload Cover Art';
        constructor (public kind: ContentKind) {}
    }
}