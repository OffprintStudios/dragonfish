import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from 'packages/client/src/app/services/auth';
import { Observable } from 'rxjs';

import { CollectionsService } from '../../../../services/content';
import { Collection } from '@pulp-fiction/models/collections';

@Injectable()
export class CollectionPageResolver implements Resolve<Collection> {
    currentUser: FrontendUser;

    constructor (private collsService: CollectionsService, private auth: AuthService) {
        this.auth.currUser.subscribe(x => { this.currentUser = x; })
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