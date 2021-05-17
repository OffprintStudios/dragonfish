import { ContentKind, ContentModel, PubChange, FormType, CreateFandomTag } from '@dragonfish/shared/models/content';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';
import { FileUploader } from 'ng2-file-upload';

export class SetFiles {
    static readonly type = '[MyStuff] Set Files';
}

export class SetCurrentContent {
    static readonly type = '[MyStuff] Set Current Content';
    constructor(public content: ContentModel | null) {}
}

export class CreateContent {
    static readonly type = '[MyStuff] Create Content';
    constructor(public kind: ContentKind, public formInfo: FormType) {}
}

export class CreateFandomTagAction {
    static readonly type = '[MyStuff] Create Fandom Tag';
    constructor(public fandomTagInfo: CreateFandomTag) {}
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

export class UpdateWordCount {
    static readonly type = '[MyStuff] Update Word Count';
    constructor(public section: Section, public pubStatus: PublishSection) {}
}
