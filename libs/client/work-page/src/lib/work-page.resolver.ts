import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentKind, PubContent } from '@dragonfish/shared/models/content';
import { ContentViewService } from '@dragonfish/client/repository/content-view';

@Injectable()
export class ContentViewResolver implements Resolve<Observable<PubContent>> {
    private pageNum = 1;

    constructor(private viewService: ContentViewService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const contentId = route.paramMap.get('contentId');
        if (route.queryParamMap.has('page')) {
            this.pageNum = +route.queryParamMap.get('page');
        }

        if (route.url[0].path === 'prose') {
            return this.viewService.fetchContent(contentId, ContentKind.ProseContent, this.pageNum);
        } else if (route.url[0].path === 'poetry') {
            return this.viewService.fetchContent(contentId, ContentKind.PoetryContent, this.pageNum);
        }
    }
}
