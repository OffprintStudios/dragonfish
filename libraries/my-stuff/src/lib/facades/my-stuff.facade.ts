import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Navigate } from '@ngxs/router-plugin';

import { ContentKind, ContentModel, PubChange } from '@dragonfish/models/content';
import { PublishSection, Section, SectionForm } from '@dragonfish/models/sections';
import { FileUploader } from 'ng2-file-upload';
import { MyStuff } from '../shared';
import { Sections } from '../shared/sections';

@Injectable({
    providedIn: 'root',
})
export class MyStuffFacade {
    @Dispatch()
    public setFiles() {
        return new MyStuff.SetFiles();
    }

    @Dispatch()
    public setCurrContent(content: ContentModel) {
        return new MyStuff.SetCurrentContent(content);
    }

    @Dispatch()
    public createContent(kind: ContentKind, formInfo: MyStuff.FormType) {
        return [new MyStuff.CreateContent(kind, formInfo), new Navigate(['/my-stuff'])];
    }

    @Dispatch()
    public saveContent(contentId: string, kind: ContentKind, formInfo: MyStuff.FormType) {
        return new MyStuff.SaveContent(contentId, kind, formInfo);
    }

    @Dispatch()
    public deleteContent(contentId: string) {
        return new MyStuff.DeleteContent(contentId);
    }

    @Dispatch()
    public publishContent(contentId: string, pubChange?: PubChange) {
        return new MyStuff.PublishContent(contentId, pubChange);
    }

    @Dispatch()
    public uploadCoverArt(uploader: FileUploader) {
        return new MyStuff.UploadCoverArt(uploader);
    }

    @Dispatch()
    public setAllSections(contentId: string) {
        return new Sections.SetAll(contentId);
    }

    @Dispatch()
    public setCurrSection(section: Section) {
        return new Sections.SetCurrent(section);
    }

    @Dispatch()
    public createSection(contentId: string, sectionInfo: SectionForm) {
        return new Sections.Create(contentId, sectionInfo);
    }

    @Dispatch()
    public saveSection(contentId: string, sectionId: string, sectionInfo: SectionForm) {
        return new Sections.Save(contentId, sectionId, sectionInfo);
    }

    @Dispatch()
    public publishSection(contentId: string, sectionId: string, pubStatus: PublishSection) {
        return new Sections.Publish(contentId, sectionId, pubStatus);
    }

    @Dispatch()
    public deleteSection(contentId: string, sectionId: string) {
        return new Sections.Delete(contentId, sectionId);
    }
}