import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CommentsService } from '@dragonfish/client/repository/comments';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { Comment, CommentKind } from '@dragonfish/shared/models/comments';
import { PaginateResult } from '@dragonfish/shared/models/util';

@Injectable()
export class CommentsResolver implements Resolve<PaginateResult<Comment>> {
    private page = 1;

    constructor(private commentsService: CommentsService, private workQuery: WorkPageQuery) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.queryParamMap.has('page')) {
            this.page = +route.queryParamMap.get('page');
        }

        return this.commentsService.getPage(this.workQuery.contentId, CommentKind.ContentComment, this.page);
    }
}
