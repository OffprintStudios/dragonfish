import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ContentModel } from '@dragonfish/shared/models/content';
import { ProfileService } from './profile.service';
import { map } from 'rxjs';

@Injectable()
export class DraftBlogResolver implements Resolve<ContentModel> {
    constructor(private profile: ProfileService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('contentId');

        return this.profile.fetchOneUnpublished(contentId).pipe(
            map((result) => {
                return result.content;
            }),
        );
    }
}
