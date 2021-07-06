import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';
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

    constructor(public route: ActivatedRoute,
        private readonly networkService: DragonfishNetworkService ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.contentData = data.workData as ContentModel[];
        });
    }

    async onSectionView(sec: SectionInfo, content: ContentModel): Promise<void> {
        this.currentContent = content;
        this.currentSection = await this.networkService.fetchSection(sec._id).toPromise();
    }

}
