import { Injectable } from '@angular/core';
import { UserBlogsQuery } from './user-blogs.query';
import { UserBlogsStore } from './user-blogs.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';

@Injectable({ providedIn: 'root' })
export class UserBlogsService {
    constructor(
        private userBlogsStore: UserBlogsStore,
        private userBlogsQuery: UserBlogsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}
}
