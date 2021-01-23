import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NewsContentModel } from '@dragonfish/models/content';
import { NetworkService } from '../../../../services';

@Injectable()
export class PostFormResolver implements Resolve<NewsContentModel> {
    constructor(private networkService: NetworkService) {}

    resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<NewsContentModel> {
        const postId = route.paramMap.get('postId');
        return this.networkService.fetchNewspostForEdit(postId);
    }
}
