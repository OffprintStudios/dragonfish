import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContentModel } from '@dragonfish/shared/models/content';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { UserBlogsService } from '@dragonfish/client/repository/profile/user-blogs';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ProfileRepository } from '@dragonfish/client/repository/profile';

@Injectable()
export class UserBlogsResolver implements Resolve<PaginateResult<ContentModel>> {
    private page = 1;

    constructor(private userBlogs: UserBlogsService, private auth: AuthService, private profile: ProfileRepository) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.queryParamMap.has('page')) {
            this.page = +route.queryParamMap.get('page');
        }

        return this.userBlogs.getPage(this.page, !this.auth.checkPseudonym(this.profile.profileId));
    }
}
