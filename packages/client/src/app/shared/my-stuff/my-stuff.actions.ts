import {
    BlogForm,
    ContentKind,
    ContentModel,
    CreatePoetry,
    CreateProse,
    NewsForm,
    PubChange,
} from '@dragonfish/models/content';
import { PublishSection, Section } from '@dragonfish/models/sections';
import { FileUploader } from 'ng2-file-upload';

export namespace MyStuff {
    export type FormType = CreateProse | CreatePoetry | BlogForm | NewsForm;

    export class SetFiles {
        static readonly type = '[MyStuff] Set Files';
        constructor() {}
    }

    export class SetCurrentContent {
        static readonly type = '[MyStuff] Set Current Content';
        constructor(public content: ContentModel | null) {}
    }

    export class CreateContent {
        static readonly type = '[MyStuff] Create Content';
        constructor(public kind: ContentKind, public formInfo: FormType) {}
    }

    export class SaveContent {
        static readonly type = '[MyStuff] Save Content';
        constructor(public contentId: string, public kind: ContentKind, public formInfo: FormType) {}
    }

    export class DeleteContent {
        static readonly type = '[MyStuff] Delete Content';
        constructor(public contentId: string) {}
    }

    export class PublishContent {
        static readonly type = '[MyStuff] Publish Content';
        constructor(public contentId: string, public pubChange?: PubChange) {}
    }

    export class UploadCoverArt {
        static readonly type = '[MyStuff] Upload Cover Art';
        constructor(public uploader: FileUploader) {}
    }

    export class UpdateWordcount {
        static readonly type = '[MyStuff] Update Wordcount';
        constructor(public section: Section, public pubStatus: PublishSection) {}
    }
}
