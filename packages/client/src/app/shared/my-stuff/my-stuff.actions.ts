import { BlogForm, ContentKind, ContentModel, CreatePoetry, CreateProse, NewsForm } from "@pulp-fiction/models/content";
import { FileUploader } from "ng2-file-upload";

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
        constructor (public contentId: string, public kind: ContentKind, public formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm) {}
    }

    export class DeleteContent {
        static readonly type = '[My Stuff] Delete Content';
        constructor (public contentId: string) {}
    }

    export class PublishContent {
        static readonly type = '[My Stuff] Publish Content';
        constructor (public contentId: string) {}
    }

    export class UploadCoverArt {
        static readonly type = '[My Stuff] Upload Cover Art';
        constructor (public kind: ContentKind, public uploader: FileUploader) {}
    }
}