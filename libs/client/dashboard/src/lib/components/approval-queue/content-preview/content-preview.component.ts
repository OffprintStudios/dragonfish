import { Component, Input } from '@angular/core';
import { ContentKind, Genres, PoetryForm, WorkStatus } from '@dragonfish/shared/models/content';
import { ActivatedRoute } from '@angular/router';
import { ApprovalQueueQuery } from '@dragonfish/client/repository/dashboard/approval-queue';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent {
    @Input() route: ActivatedRoute;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    addEditIcon = false;

    constructor(public queueQuery: ApprovalQueueQuery) {
        console.log(this.queueQuery.getValue());
    }
}
