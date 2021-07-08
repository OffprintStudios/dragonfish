import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Section, SectionForm } from '@dragonfish/shared/models/sections';
import { UserInfo } from '@dragonfish/shared/models/users';
import { SectionInfo } from '@dragonfish/shared/models/works';

@Component({
    selector: 'dragonfish-quill-migrator',
    templateUrl: './quill-migrator.component.html',
    styleUrls: ['./quill-migrator.component.scss']
})
export class QuillMigratorComponent implements OnInit {
    public contentData: ContentModel[];
    public currentContent?: ContentModel;
    public currentSection?: Section;
    public isConverting = false;

    constructor(public route: ActivatedRoute,
        private readonly networkService: DragonfishNetworkService ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.contentData = data.workData as ContentModel[];
        });
    }

    async onViewSectionClick(sec: SectionInfo, content: ContentModel): Promise<void> {
        this.currentContent = content;
        this.currentSection = await this.networkService.fetchSection(sec._id).toPromise();
    }

    async onConvertClick(): Promise<void> {
        // TODO: Create endpoint that will modify the given work's section with the HTML content of the quillView,
        // without the usual author guards.
        // Use that endpoint here.
        if (!this.currentContent || !this.currentSection) {
            console.log("Either currentContent or currentSection is null. Naw man.");
            return;
        }

        this.isConverting = true;
        const authorInfo = this.currentContent.author as UserInfo;
        const renderedBody = "";
        const renderedAuthorsNote = "";
        const newSectionInfo = <SectionForm> {
            title: this.currentSection.title,
            usesNewEditor: true,
            body: renderedBody,
            authorsNote: renderedAuthorsNote,
            authorsNotePos: this.currentSection.authorsNotePos,
            oldWords: this.currentSection.stats.words,
        };
        try {
            const updatedSection = this.networkService.migrateQuillSection(authorInfo._id, this.currentContent._id, this.currentSection._id, newSectionInfo);
        }
        catch(e) {
            console.log(`Failed to update section. Details: ${e}`);
        }
    }

}
