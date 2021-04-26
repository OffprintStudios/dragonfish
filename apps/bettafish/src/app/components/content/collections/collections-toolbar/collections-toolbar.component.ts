import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Collection } from '@dragonfish/shared/models/collections';
import { CollectionsState } from '../../../../repo/collections';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-collections-toolbar',
    templateUrl: './collections-toolbar.component.html',
    styleUrls: ['./collections-toolbar.component.scss']
})
export class CollectionsToolbarComponent {
    @Select(CollectionsState.currCollection) currCollection$: Observable<Collection>;

    constructor(private dialog: MatDialog) {}

    /**
     * Opens the create collection modal
     */
    openCreateCollectionModal() {
        const dialogRef = this.dialog.open(CollectionFormComponent);

        dialogRef.afterClosed().subscribe(() => {
            location.reload();
        });
    }
}
