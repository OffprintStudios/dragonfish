import { Component, Input } from '@angular/core';
import { Collection } from '@dragonfish/shared/models/collections';
import { MatDialog } from '@angular/material/dialog';
import { NetworkService } from '../../../../services';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-collection-card',
    templateUrl: './collection-card.component.html',
    styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {
    @Input() collection: Collection;
    @Input() user: FrontendUser;
    submitting = false;

    constructor(private dialog: MatDialog, private networkService: NetworkService) {}

    /**
     * Opens the create collection modal in edit mode.
     *
     * @param coll The collection to edit
     */
    openEditCollectionModal(coll: Collection) {
        const dialogRef = this.dialog.open(CollectionFormComponent, { data: { currColl: coll } });

        dialogRef.afterClosed().subscribe(() => {
            location.reload();
        });
    }

    /**
     * Sets a collection to public or private depending on the value of the setPublic boolean.
     *
     * @param collId The collection's ID
     * @param setPublic whether or not this request is to set a collection to public or private
     */
    setPublicPrivate(collId: string, setPublic: boolean) {
        if (setPublic) {
            this.submitting = true;
            this.networkService.setCollectionToPublic(collId).subscribe(() => {
                this.submitting = false;
                location.reload();
            });
        } else {
            this.submitting = true;
            this.networkService.setCollectionToPrivate(collId).subscribe(() => {
                this.submitting = false;
                location.reload();
            });
        }
    }

    /**
     * Sends a request to delete the specified collection.
     *
     * @param collId The collection to delete
     */
    askDelete(collId: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this collection?',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.networkService.deleteCollection(collId).subscribe(() => {
                    location.reload();
                });
            } else {
                return;
            }
        });
    }
}
