import { Component, Input, OnInit } from '@angular/core';
import { ContentKind, ContentModel, Genres, PoetryForm, TagKind, WorkStatus } from '@dragonfish/shared/models/content';
import { ActivatedRoute } from '@angular/router';
import { ApprovalQueueQuery } from '@dragonfish/client/repository/dashboard/approval-queue';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent implements OnInit {
    @Input() route: ActivatedRoute;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    tagKind = TagKind;
    addEditIcon = false;

    constructor(public queueQuery: ApprovalQueueQuery) {
        console.log(this.queueQuery.getValue());
    }

    ngOnInit(): void {
        if (this.queueQuery.selected$) {
            this.queueQuery.selected$.subscribe((currDoc) => {
                setThreePartTitle(Constants.DASHBOARD, (currDoc.workToApprove as ContentModel).title);
            })
        }
    }
}
