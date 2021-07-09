import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentKind, Genres, WorkStatus } from '@dragonfish/shared/models/content';
import { ContentViewQuery } from '@dragonfish/client/repository/content-view';

@Component({
    selector: 'dragonfish-content-box',
    templateUrl: './content-box.component.html',
    styleUrls: ['./content-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentBoxComponent {
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;

    constructor(public viewQuery: ContentViewQuery) {}
}
