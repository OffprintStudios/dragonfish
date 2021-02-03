import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../../shared/user';

import { Collection } from '@dragonfish/models/collections';
import { FrontendUser } from '@dragonfish/models/users';
import { CreateCollectionComponent } from 'packages/client/src/app/components/modals/collections';
import { CollectionsService } from 'packages/client/src/app/services/content';

@Component({
    selector: 'collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.less']
})
export class CollectionPageComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    portUser: FrontendUser;

    collData: Collection;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
        private collsService: CollectionsService, private location: Location) {
            this.currentUserSubscription = this.currentUser$.subscribe(x => {
                this.currentUser = x;
            });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        this.route.data.subscribe(data => {
            console.log(data.collData);
            this.collData = data.collData as Collection;
        });
    }

    /**
     * Checks to see if the currently logged in user is the same as the one
     * that owns this portfolio.
     */
    currentUserIsSame() {
        return this.currentUser && this.portUser && this.currentUser._id === this.portUser._id;
    }

    /**
     * Opens the create collection modal in edit mode.
     * 
     * @param coll The collection to edit
     */
    openEditCollectionModal(coll: Collection) {
        const dialogRef = this.dialog.open(CreateCollectionComponent, {data: {currColl: coll}});

        dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge'});
        });
    }

    /**
     * Sends a request to delete the specified collection.
     * 
     * @param collId The collection to delete
     */
    askDelete(collId: string) {
        if (confirm(`Are you sure you want to delete this collection? This action is irreversible.`)) {
            this.collsService.deleteCollection(collId).subscribe(() => {
                this.location.back();
            });
        } else {
            return;
        }
    }

    /**
     * Sets a collection to public or private depending on the value of the setPublic boolean.
     * 
     * @param collId The collection's ID
     * @param setPublic whether or not this request is to set a collection to public or private
     */
    setPublicPrivate(collId: string, setPublic: boolean) {
        if (setPublic) {
            this.collsService.setToPublic(collId).subscribe(() => {
                this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge'});
            });
        } else {
            this.collsService.setToPrivate(collId).subscribe(() => {
                this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge'});
            });
        }
    }
}