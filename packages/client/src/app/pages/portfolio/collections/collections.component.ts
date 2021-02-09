import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';

import { FrontendUser } from '@dragonfish/models/users';
import { Collection } from '@dragonfish/models/collections';
import { PaginateResult } from '@dragonfish/models/util';
import { NetworkService } from '../../../services';
import { Title, Constants } from '@dragonfish/utilities/constants';
import { CreateCollectionComponent } from '../../../components/modals/collections';

@Component({
    selector: 'port-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.less'],
})
export class CollectionsComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    portUser: FrontendUser;
    collsData: PaginateResult<Collection>;

    pageNum = 1;
    submitting = false;
    listView = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private networkService: NetworkService,
        private dialog: MatDialog,
    ) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.COLLECTIONS);

        this.route.data.subscribe((data) => {
            this.collsData = data.feedData as PaginateResult<Collection>;
        });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
        this.pageNum = event;
    }

    /**
     * Checks to see if the currently logged in user is the same as the one
     * that owns this portfolio.
     */
    currentUserIsSame() {
        return this.currentUser && this.portUser && this.currentUser._id === this.portUser._id;
    }

    /**
     * Opens the create collection modal
     */
    openCreateCollectionModal() {
        const dialogRef = this.dialog.open(CreateCollectionComponent);

        dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.pageNum },
                queryParamsHandling: 'merge',
            });
        });
    }

    /**
     * Opens the create collection modal in edit mode.
     *
     * @param coll The collection to edit
     */
    openEditCollectionModal(coll: Collection) {
        const dialogRef = this.dialog.open(CreateCollectionComponent, { data: { currColl: coll } });

        dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.pageNum },
                queryParamsHandling: 'merge',
            });
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
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        } else {
            this.submitting = true;
            this.networkService.setCollectionToPrivate(collId).subscribe(() => {
                this.submitting = false;
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        }
    }

    /**
     * Sends a request to delete the specified collection.
     *
     * @param collId The collection to delete
     */
    askDelete(collId: string) {
        if (confirm(`Are you sure you want to delete this collection? This action is irreversible.`)) {
            this.networkService.deleteCollection(collId).subscribe(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        } else {
            return;
        }
    }
}
