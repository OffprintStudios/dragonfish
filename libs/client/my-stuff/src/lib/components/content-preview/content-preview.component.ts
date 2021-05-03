import { ContentKind, ContentModel, Genres, PoetryForm, WorkStatus } from '@dragonfish/shared/models/content';

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyStuffState } from '../../repo';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UploadCoverArtComponent } from '../upload-cover-art/upload-cover-art.component';

@Component({
    selector: 'dragonfish-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent {
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
    poetryForm = PoetryForm;
    addEditIcon = false;

    constructor(private dialog: MatDialog) {}

    uploadCoverArt(contentId: string, kind: ContentKind) {
        this.dialog.open(UploadCoverArtComponent, { data: { kind: kind, contentId: contentId } });
    }
}
