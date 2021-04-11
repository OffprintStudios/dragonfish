import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ContentKind, Genres, WorkStatus } from '@dragonfish/shared/models/content';
import { ContentState, ContentStateModel } from '../../../repo/content';

@Component({
    selector: 'dragonfish-content-box',
    templateUrl: './content-box.component.html',
    styleUrls: ['./content-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentBoxComponent implements OnChanges {
    @Select(ContentState) content$: Observable<ContentStateModel>;
    @Input() route: ActivatedRoute;
    contentKind = ContentKind;
    contentStatus = WorkStatus;
    contentGenres = Genres;

    ngOnChanges(changes: SimpleChanges) {
        const value = changes['route'];
        if (value.previousValue !== undefined) {
            this.route = value.currentValue;
        }
    }
}
