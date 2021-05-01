import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ContentModel, ContentKind, FormType, PubChange } from '@dragonfish/shared/models/content';
import { PublishSection, Section, SectionForm } from '@dragonfish/shared/models/sections';
import * as MyStuff from '../my-stuff.actions';
import * as Sections from '../sections/sections.actions';
import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class MyStuffService {
    @Dispatch()
    public async setFiles() {
        return new MyStuff.SetFiles();
    }

    @Dispatch()
    public setCurrentContent(content: ContentModel) {
        return new MyStuff.SetCurrentContent(content);
    }

    @Dispatch()
    public createContent(kind: ContentKind, formInfo: FormType) {
        return new MyStuff.CreateContent(kind, formInfo);
    }

    @Dispatch()
    public saveContent(contentId: string, kind: ContentKind, formInfo: FormType) {
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
    public updateWordCount(section: Section, pubStatus: PublishSection) {
        return new MyStuff.UpdateWordCount(section, pubStatus);
    }

    @Dispatch()
    public setAllSections(contentId: string) {
        return new Sections.SetAll(contentId);
    }

    @Dispatch()
    public setCurrentSection(section: Section) {
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
