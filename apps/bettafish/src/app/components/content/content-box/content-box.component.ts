import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ContentKind, Genres, WorkStatus } from '@dragonfish/shared/models/content';
import { ContentState, ContentStateModel } from '@dragonfish/client/repository/content';

@Component({
    selector: 'dragonfish-content-box',
    templateUrl: './content-box.component.html',
    styleUrls: ['./content-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentBoxComponent {
    @Select(ContentState) content$: Observable<ContentStateModel>;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;
}
