import { Injectable } from '@angular/core';
import { CommentsStore } from './comments.store';
import { CommentsQuery } from './comments.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { CommentKind, Comment, CommentForm } from '@dragonfish/shared/models/comments';
import { catchError, map, tap } from 'rxjs/operators';
import { PaginationResponse } from '@datorama/akita';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentsService {
    constructor(
        private comments: CommentsStore,
        private commentsQuery: CommentsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public getPage(itemId: string, kind: CommentKind, page: number) {
        return this.network.fetchComments(itemId, kind, page).pipe(
            map((comments) => {
                const paginateComments: PaginationResponse<Comment> = {
                    currentPage: comments.page,
                    data: comments.docs,
                    total: comments.totalDocs,
                    lastPage: comments.totalPages,
                    perPage: comments.limit,
                };
                return paginateComments;
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong fetching the current page!`);
                return throwError(err);
            }),
        );
    }

    public addComment(itemId: string, kind: CommentKind, formInfo: CommentForm) {
        return this.network.addComment(itemId, kind, formInfo).pipe(
            tap((comment) => {
                this.comments.add(comment);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong adding a comment!`);
                return throwError(err);
            }),
        );
    }

    public editComment(commentId: string, formInfo: CommentForm) {
        return this.network.editComment(commentId, formInfo).pipe(
            tap(() => {
                this.comments.update(commentId, {
                    body: formInfo.body,
                });
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong editing this comment!`);
                return throwError(err);
            }),
        );
    }
}
