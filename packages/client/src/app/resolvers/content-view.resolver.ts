import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Content } from '../shared/content';
import { ContentKind } from '@dragonfish/models/content';

@Injectable()
export class ContentViewResolver implements Resolve<void> {
    constructor(private store: Store) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const contentId = route.paramMap.get('contentId');

        if (route.url[0].path === 'prose') {
            return this.store.dispatch(new Content.FetchOne(contentId, ContentKind.ProseContent));
        } else if (route.url[0].path === 'poetry') {
            return this.store.dispatch(new Content.FetchOne(contentId, ContentKind.PoetryContent));
        } else if (route.url[0].path === 'post') {
            return this.store.dispatch(new Content.FetchOne(contentId, ContentKind.NewsContent));
        } else if (route.url[0].path === 'blog') {
            return this.store.dispatch(new Content.FetchOne(contentId, ContentKind.BlogContent));
        }
    }
}
