import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CommentsService } from '@dragonfish/client/repository/comments';
import { Comment, CommentKind } from '@dragonfish/shared/models/comments';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { BlogPageQuery } from '@dragonfish/client/repository/profile/blog-page';

@Injectable()
export class BlogCommentsResolver implements Resolve<PaginateResult<Comment>> {
    private page = 1;

    constructor(private commentsService: CommentsService, private blogPage: BlogPageQuery) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.queryParamMap.has('page')) {
            this.page = +route.queryParamMap.get('page');
        }

        return this.commentsService.getPage(this.blogPage.blogId, CommentKind.ContentComment, this.page);
    }
}
