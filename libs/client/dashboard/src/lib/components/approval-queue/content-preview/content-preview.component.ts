import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { ApprovalQueueState } from '../../../shared/approval-queue';
import { Observable } from 'rxjs';
import {
    ContentKind,
    Genres,
    PoetryForm,
    SectionInfo,
    WorkStatus,
} from '@dragonfish/shared/models/content';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent {
    @Select(ApprovalQueueState.selectedDoc) currDoc$: Observable<ApprovalQueue>;
    @Select(ApprovalQueueState.selectedDocSections) currSections$: Observable<SectionInfo[]>;
    @Input() route: ActivatedRoute;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    addEditIcon = false;
}
