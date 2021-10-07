import { Component, Inject, OnInit } from '@angular/core';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Comment, CommentKind } from '@dragonfish/shared/models/comments';
import { COMMENTS_PAGINATOR, CommentsService } from '@dragonfish/client/repository/comments';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'dragonfish-content-comments',
    templateUrl: './content-comments.component.html',
    styleUrls: ['./content-comments.component.scss'],
})
export class ContentCommentsComponent implements OnInit {
    comments$: Observable<PaginationResponse<Comment>>;
    commentKinds = CommentKind;

    constructor(
        @Inject(COMMENTS_PAGINATOR) public paginatorRef: PaginatorPlugin<Comment>,
        private commentsService: CommentsService,
        public workQuery: WorkPageQuery,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap
            .pipe(
                map((params) => {
                    if (params.has('page')) {
                        return +params.get('page');
                    } else {
                        return 1;
                    }
                }),
                untilDestroyed(this),
            )
            .subscribe((page) => this.paginatorRef.setPage(page));

        this.comments$ = this.paginatorRef.pageChanges.pipe(
            switchMap((page) => {
                const reqFn = () =>
                    this.commentsService.getPage(this.workQuery.contentId, CommentKind.ContentComment, page);
                return this.paginatorRef.getPage(reqFn) as Observable<PaginationResponse<Comment>>;
            }),
        );
    }
}
