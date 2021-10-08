import { Component } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { CommentsQuery, CommentsService } from '@dragonfish/client/repository/comments';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-content-comments',
    templateUrl: './content-comments.component.html',
    styleUrls: ['./content-comments.component.scss'],
})
export class ContentCommentsComponent {
    commentKinds = CommentKind;

    constructor(
        private commentsService: CommentsService,
        public commentsQuery: CommentsQuery,
        public workQuery: WorkPageQuery,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
    }
}
