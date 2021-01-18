import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { AuthState } from '../../../shared/auth';

import { FrontendUser } from '@pulp-fiction/models/users';
import { CollectionsService } from '../../../services/content';
import { AuthService } from '../../../services/auth';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Collection } from '@pulp-fiction/models/collections';

@Injectable()
export class CollectionsResolver implements Resolve<PaginateResult<Collection>> {
    @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    pageNum: number = 1;

    constructor(private collsService: CollectionsService, private auth: AuthService) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve (route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PaginateResult<Collection>> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        if (this.currentUser) {
            if (this.currentUser._id === userId) {
                return this.collsService.getAllCollections(this.pageNum);
            } else {
                return this.collsService.getPublicCollections(userId, this.pageNum);
            }
        } else {
            return this.collsService.getPublicCollections(userId, this.pageNum);
        }
    }
}