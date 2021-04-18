import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ApprovalQueueState } from '../../../shared/approval-queue';
import { Observable } from 'rxjs';
import { ContentKind, ContentModel, Genres, PoetryForm, WorkStatus } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent {
    @Select(ApprovalQueueState.selectedDoc) currContent$: Observable<ContentModel>;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    addEditIcon = false;
}
