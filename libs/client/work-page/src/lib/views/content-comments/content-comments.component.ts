import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Comment, CommentKind } from '@dragonfish/shared/models/comments';
import { COMMENTS_PAGINATOR, CommentsService } from '@dragonfish/client/repository/comments';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-content-comments',
    templateUrl: './content-comments.component.html',
    styleUrls: ['./content-comments.component.scss'],
})
export class ContentCommentsComponent implements OnInit, OnDestroy {
    comments$: Observable<PaginationResponse<Comment>>;

    constructor(
        @Inject(COMMENTS_PAGINATOR) public paginator: PaginatorPlugin<Comment>,
        private commentsService: CommentsService,
        private workQuery: WorkPageQuery,
    ) {}

    ngOnInit(): void {
        this.comments$ = this.paginator.pageChanges.pipe(
            switchMap((page) => {
                const reqFn = () =>
                    this.commentsService.getPage(this.workQuery.contentId, CommentKind.ContentComment, page);
                return this.paginator.getPage(reqFn) as Observable<PaginationResponse<Comment>>;
            }),
            untilDestroyed(this),
        );
    }

    ngOnDestroy(): void {
        this.paginator.destroy();
    }
}
