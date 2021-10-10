import { Injectable } from '@angular/core';
import { ProfileQuery } from './profile.query';
import { ProfileStore } from './profile.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { catchError, tap } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { AppQuery } from '@dragonfish/client/repository/app';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(
        private profileQuery: ProfileQuery,
        private profileStore: ProfileStore,
        private appQuery: AppQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public setProfile(pseudId: string) {
        this.profileStore.setLoading(true);
        return zip(
            this.network.getProfile(pseudId),
            this.network.getProfileContent(pseudId, this.appQuery.filter),
        ).pipe(
            tap((result) => {
                this.profileStore.update({
                    currProfile: result[0],
                    homeWorks: result[1].works,
                    homeBlogs: result[1].blogs,
                });
                this.profileStore.setLoading(false);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }
}
