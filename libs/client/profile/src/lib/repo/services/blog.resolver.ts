import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentKind, PubContent } from '@dragonfish/shared/models/content';
import { ContentViewService } from '@dragonfish/client/repository/content-view';

@Injectable()
export class BlogResolver implements Resolve<Observable<PubContent>> {
    private pageNum = 1;

    constructor(private viewService: ContentViewService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('contentId');
        if (route.queryParamMap.has('page')) {
            this.pageNum = +route.queryParamMap.get('page');
        }

        return this.viewService.fetchContent(contentId, ContentKind.BlogContent, this.pageNum);
    }
}
