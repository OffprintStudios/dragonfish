import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../../shared/user';

import { CollectionsService } from '../../../../services/content';
import { Collection } from '@pulp-fiction/models/collections';

@Injectable()
export class CollectionPageResolver implements Resolve<Collection> {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    constructor (private collsService: CollectionsService) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Collection> {
        const userId = route.parent.paramMap.get('id');
        const collectionId = route.paramMap.get('collId');

        if (this.currentUser) {
            if (this.currentUser._id === userId) {
                return this.collsService.getOneCollection(collectionId, false);
            } else {
                return this.collsService.getOneCollection(collectionId, true);
            }
        } else {
            return this.collsService.getOneCollection(collectionId, true);
        }
    }
}