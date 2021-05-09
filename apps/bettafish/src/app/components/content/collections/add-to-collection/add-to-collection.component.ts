import { Component, Inject } from '@angular/core';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Collection } from '@dragonfish/shared/models/collections';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-add-to-collection',
    templateUrl: './add-to-collection.component.html',
    styleUrls: ['./add-to-collection.component.scss'],
})
export class AddToCollectionComponent {
    currContent: ContentModel;
    collections: Collection[];

    loading = false;

    constructor(
        private networkService: DragonfishNetworkService,
        private dialogRef: MatDialogRef<AddToCollectionComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { content: ContentModel },
    ) {
        this.fetchData();
    }

    ngOnInit(): void {
        this.currContent = this.data.content;
    }

    private fetchData() {
        this.loading = true;
        this.networkService.fetchAllCollectionsNoPaginate().subscribe((colls) => {
            this.collections = colls;
            console.log(this.collections);
            this.loading = false;
        });
    }

    /**
     * If the work ID is listed in
     * @param coll The collection to check
     */
    checkIfInCollection(coll: Collection) {
        let isThere = null;

        coll.contains.forEach((entry) => {
            const thisContent = entry as ContentModel;
            if (thisContent._id === this.currContent._id) {
                isThere = entry;
            }
        });

        if (isThere) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Adds a work to a collection.
     *
     * @param coll The collection in question
     */
    addToCollection(coll: Collection) {
        this.networkService.addWorkToCollection(coll._id, this.currContent._id).subscribe(() => {
            this.dialogRef.close();
        });
    }

    /**
     * Removes a work from a collection.
     *
     * @param coll The collection in question
     */
    removeFromCollection(coll: Collection) {
        this.networkService.removeWorkFromCollection(coll._id, this.currContent._id).subscribe(() => {
            this.dialogRef.close();
        });
    }

    /**
     * Closes the modal.
     */
    cancel() {
        this.dialogRef.close();
    }
}
