import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Collection } from '@dragonfish/shared/models/collections';
import { CollectionsState } from '../../../../repo/collections';

@Component({
    selector: 'dragonfish-collections-toolbar',
    templateUrl: './collections-toolbar.component.html',
    styleUrls: ['./collections-toolbar.component.scss']
})
export class CollectionsToolbarComponent {
    @Select(CollectionsState.currCollection) currCollection$: Observable<Collection>;
}
