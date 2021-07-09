import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { Collection } from '@dragonfish/shared/models/collections';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Injectable()
export class CollectionPageResolver implements Resolve<Collection> {
    constructor(private networkService: DragonfishNetworkService, private sessionQuery: SessionQuery) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Collection> {
        const userId = route.parent.paramMap.get('id');
        const collectionId = route.paramMap.get('collId');

        if (this.sessionQuery.currentUser) {
            if (this.sessionQuery.currentUser._id === userId) {
                return this.networkService.fetchOneCollection(collectionId);
            } else {
                return this.networkService.fetchOnePublicCollection(userId, collectionId);
            }
        } else {
            return this.networkService.fetchOnePublicCollection(userId, collectionId);
        }
    }
}
