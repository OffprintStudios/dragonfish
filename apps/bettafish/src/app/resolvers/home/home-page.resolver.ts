import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NewsContentModel } from '@dragonfish/shared/models/content';

import { DragonfishNetworkService } from '@dragonfish/client/services';

@Injectable()
export class HomePageResolver implements Resolve<NewsContentModel[]> {
    constructor(private networkService: DragonfishNetworkService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<NewsContentModel[]> {
        return this.networkService.fetchInitialNewsPosts();
    }
}
