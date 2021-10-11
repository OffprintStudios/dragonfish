import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContentModel } from '@dragonfish/shared/models/content';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileQuery } from '@dragonfish/client/repository/profile';
import { UserWorksService } from '@dragonfish/client/repository/profile/user-works';

@Injectable()
export class UserWorksResolver implements Resolve<PaginateResult<ContentModel>> {
    private page = 1;

    constructor(private userWorks: UserWorksService, private auth: AuthService, private profileQuery: ProfileQuery) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.queryParamMap.has('page')) {
            this.page = +route.queryParamMap.get('page');
        }

        return this.userWorks.getPage(this.page, !this.auth.checkPseudonym(this.profileQuery.profileId));
    }
}
