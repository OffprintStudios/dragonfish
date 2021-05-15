import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { ContentViewService } from '@dragonfish/client/repository/content-view';

@Injectable()
export class ContentViewResolver implements Resolve<Observable<[ContentModel, any]>> {
    constructor(private viewService: ContentViewService) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const contentId = route.paramMap.get('contentId');

        if (route.url[0].path === 'prose') {
            return this.viewService.fetchContent(contentId, ContentKind.ProseContent);
        } else if (route.url[0].path === 'poetry') {
            return this.viewService.fetchContent(contentId, ContentKind.PoetryContent);
        } else if (route.url[0].path === 'news') {
            return this.viewService.fetchContent(contentId, ContentKind.NewsContent);
        } else if (route.url[0].path === 'post') {
            return this.viewService.fetchContent(contentId, ContentKind.BlogContent);
        }
    }
}
