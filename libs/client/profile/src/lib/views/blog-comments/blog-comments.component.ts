import { Component } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { CommentsQuery, CommentsService } from '@dragonfish/client/repository/comments';
import { BlogPageQuery } from '@dragonfish/client/repository/profile/blog-page';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-blog-comments',
    templateUrl: './blog-comments.component.html',
    styleUrls: ['./blog-comments.component.scss'],
})
export class BlogCommentsComponent {
    commentKinds = CommentKind;

    constructor(
        private commentsService: CommentsService,
        public commentsQuery: CommentsQuery,
        public blogQuery: BlogPageQuery,
        private router: Router,
        private route: ActivatedRoute,
        public session: SessionQuery,
    ) {}

    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
    }
}
