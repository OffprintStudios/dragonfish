import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '@dragonfish/client/repository/user';

import { DragonfishNetworkService } from '@dragonfish/client/services';
import { Collection } from '@dragonfish/shared/models/collections';

@Injectable()
export class CollectionPageResolver implements Resolve<Collection> {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    constructor(private networkService: DragonfishNetworkService) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Collection> {
        const userId = route.parent.paramMap.get('id');
        const collectionId = route.paramMap.get('collId');

        if (this.currentUser) {
            if (this.currentUser._id === userId) {
                return this.networkService.fetchOneCollection(collectionId);
            } else {
                return this.networkService.fetchOnePublicCollection(userId, collectionId);
            }
        } else {
            return this.networkService.fetchOnePublicCollection(userId, collectionId);
        }
    }
}
