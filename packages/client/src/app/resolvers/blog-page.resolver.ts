import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Blog } from '@pulp-fiction/models/blogs';
import { PortfolioService } from '../services/content';

@Injectable()
export class BlogPageResolver implements Resolve<Blog> {
    constructor (private portService: PortfolioService) { }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Blog> {
        const blogId = route.paramMap.get('blogId');
        return this.portService.getBlog(blogId);
    }
}