import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CollPage } from '../models/site';
import { PortfolioService } from '../services/content';

@Injectable()
export class CollectionPageResolver implements Resolve<CollPage> {
    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<CollPage> {
        const userId = route.parent.paramMap.get('id');
        const collectionId = route.paramMap.get('collId');
        
        const coll = this.portService.getOneCollection(userId, collectionId);

        return zip(coll, of(userId)).pipe(map(value => {
            const collData: CollPage = {
                collection: value[0],
                userId: value[1]
            };

            return collData;
        }));
    }
}