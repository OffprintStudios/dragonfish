import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Observable, zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PortBlogs } from '../models/site';
import { AuthService } from '../services/auth';
import { BlogsService, PortfolioService } from '../services/content';

@Injectable()
export class PortBlogsResolver implements Resolve<PortBlogs> {
    currentUser: FrontendUser
    pageNum: number = 1;

    constructor (private portService: PortfolioService, private blogsService: BlogsService, private authService: AuthService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<PortBlogs> {
        const userId = route.parent.paramMap.get('id');
        const pageNum = +route.queryParamMap.get('page');

        if (pageNum) {
            this.pageNum = pageNum;
        }

        const blogsList = this.portService.getBlogList(userId, this.pageNum);
        const userBlogs = this.blogsService.fetchUserBlogs(this.pageNum);

        if (this.currentUser) {
            const userBlogsList = this.blogsService.fetchUserBlogs(this.pageNum);

            return zip(blogsList, userBlogsList).pipe(map(value => {
                const portBlogs: PortBlogs = {
                    blogs: value[0],
                    userBlogs: value[1]
                };
    
                return portBlogs;
            }));
        } else {
            return zip(blogsList, of(null)).pipe(map(value => {
                const portBlogs: PortBlogs = {
                    blogs: value[0],
                    userBlogs: value[1]
                };
                return portBlogs;
            }));
        }
    }
}