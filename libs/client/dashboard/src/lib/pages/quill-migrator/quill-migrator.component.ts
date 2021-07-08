import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '@dragonfish/client/alerts';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Section, SectionForm } from '@dragonfish/shared/models/sections';
import { UserInfo } from '@dragonfish/shared/models/users';
import { SectionInfo } from '@dragonfish/shared/models/works';
import { OldDataService } from './old-data-service';

@Component({
    selector: 'dragonfish-quill-migrator',
    templateUrl: './quill-migrator.component.html',
    styleUrls: ['./quill-migrator.component.scss']
})
export class QuillMigratorComponent implements OnInit {
    public contentData: ContentModel[];
    public currentContent?: ContentModel;
    public currentSection?: Section;
    public isListRefreshing = false;
    public isConverting = false;

    constructor(public route: ActivatedRoute,
        private readonly networkService: DragonfishNetworkService,
        private readonly oldDataService: OldDataService,
        private readonly alertsService: AlertsService) { }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.contentData = data.workData as ContentModel[];
        });
    }

    async onViewSectionClick(sec: SectionInfo, content: ContentModel): Promise<void> {
        this.currentContent = undefined;
        this.currentSection = undefined;
        this.currentContent = content;
        this.currentSection = await this.networkService.fetchSection(sec._id).toPromise();
    }

    async onConvertClick(): Promise<void> {
        if (!this.currentContent || !this.currentSection) {
            this.alertsService.error("You have to select a section to view first.");
            return;
        }
        const sectionIsQuill = this.currentSection.body.startsWith("{\"ops\":");
        const authorsNoteIsQuill = this.currentSection.authorsNote?.startsWith("{\"ops\":");
        console.log(`sectionIsQuill: ${sectionIsQuill}. authorsNoteIsquill: ${authorsNoteIsQuill}`);

        if (!sectionIsQuill && !authorsNoteIsQuill) {
            this.alertsService.error("This section isn't in Quill format.");
            return;
        }

        this.isConverting = true;
        try {
            const authorInfo = this.currentContent.author as UserInfo;
            const renderedBody = sectionIsQuill
                ? this.getQuillHtml(document.querySelector("#contentView"))
                : this.currentSection.body;
            const renderedAuthorsNote = authorsNoteIsQuill
                ? this.getQuillHtml(document.querySelector("#authorsNoteView"))
                : this.currentSection.authorsNote;
            const newSectionInfo = <SectionForm> {
                title: this.currentSection.title,
                usesNewEditor: true,
                body: renderedBody,
                authorsNote: renderedAuthorsNote,
                authorsNotePos: this.currentSection.authorsNotePos,
                oldWords: this.currentSection.stats.words,
            };
            const updatedSection = await this.networkService.migrateQuillSection(authorInfo._id, this.currentContent._id, this.currentSection._id, newSectionInfo)
                .toPromise();

            this.currentSection.body = updatedSection.body;
            this.currentSection.authorsNote = updatedSection.authorsNote;

            this.alertsService.success(`Section '${this.currentSection.title}' converted!`);
            this.isConverting = false;
        }
        catch(e) {
            this.alertsService.error(`Failed to update section '${this.currentSection.title}'. See the browser console for details.`);
            console.log(`Failed to update section. Details: ${e}`);
            this.isConverting = false;
        }
    }

    async onRefreshClick() {
        this.isListRefreshing = true;
        this.contentData = await this.oldDataService.getOldContent();
        this.isListRefreshing = false;
    }

    private getQuillHtml(startingElement: Element): string {
        const wrapperDiv = startingElement.querySelector("div.ql-editor");

        wrapperDiv.querySelectorAll("*").forEach(x => {
         // Replace Quill alignment styles with inline styles
         if (x.className === "ql-align-center") {
           x.setAttribute("style", "text-align: center;");
         }
         if (x.className === "ql-align-right") {
           x.setAttribute("style", "text-align: right;");
         }
         if (x.className === "ql-align-jutify") {
           x.setAttribute("style", "text-align:justify;");
         }

         // Remove ALL <img> elements--they're all Base64, because lol QuillJS
         // sorry authors =(
         if (x.nodeName.toLowerCase() === 'img') {
           x.remove();
         }
       });

       // Replace all newline chars with a <br>, and return the resulting HTML string
       return wrapperDiv.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');;
    }

}
