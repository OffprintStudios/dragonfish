import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { BlogForm, ContentKind, ContentModel, CreatePoetry, CreateProse, NewsForm } from '@pulp-fiction/models/content';
import { FileUploader } from 'ng2-file-upload';

import { MyStuff } from '../../shared/my-stuff';

@Injectable({
    providedIn: 'root'
})
export class MyStuffPageService {
    @Dispatch()
    public setFiles() {
        return new MyStuff.SetFiles();
    }

    @Dispatch()
    public setCurrContent(content: ContentModel) {
        return new MyStuff.SetCurrentContent(content);
    }

    @Dispatch()
    public createContent(kind: ContentKind, formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm) {
        return new MyStuff.CreateContent(kind, formInfo)
    }

    @Dispatch()
    public saveContent(contentId: string, kind: ContentKind, formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm) {
        return new MyStuff.SaveContent(contentId, kind, formInfo);
    }

    @Dispatch()
    public deleteContent(contentId: string) {
        return new MyStuff.DeleteContent(contentId);
    }

    @Dispatch()
    public publishContent(contentId: string) {
        return new MyStuff.PublishContent(contentId);
    }

    @Dispatch()
    public uploadCoverArt(kind: ContentKind, uploader: FileUploader) {
        return new MyStuff.UploadCoverArt(kind, uploader);
    }
}