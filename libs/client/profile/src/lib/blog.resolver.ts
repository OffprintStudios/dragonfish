import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PubContent } from '@dragonfish/shared/models/content';
import { BlogPageService } from '@dragonfish/client/repository/profile/blog-page';

@Injectable()
export class BlogResolver implements Resolve<Observable<PubContent>> {
    constructor(private blogPage: BlogPageService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('contentId');

        return this.blogPage.fetchContent(contentId);
    }
}
