import { Injectable } from '@angular/core';
import { CommentsStore } from './comments.store';
import { CommentsQuery } from './comments.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { CommentKind, CommentForm, Comment } from '@dragonfish/shared/models/comments';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PseudonymsQuery } from '../pseudonyms';

@Injectable({ providedIn: 'root' })
export class CommentsService {
    constructor(
        private comments: CommentsStore,
        private commentsQuery: CommentsQuery,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public getPage(itemId: string, kind: CommentKind, page: number) {
        return this.network.fetchComments(itemId, kind, page).pipe(
            tap((comments) => {
                this.comments.set(comments.docs);
                this.comments.update({
                    currPage: page,
                    totalComments: comments.totalDocs,
                    totalPages: comments.totalPages,
                    perPage: comments.limit,
                });
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong fetching the current page!`);
                return throwError(err);
            }),
        );
    }

    public addComment(itemId: string, kind: CommentKind, formInfo: CommentForm) {
        return this.network.addComment(this.pseudQuery.currentId, itemId, kind, formInfo).pipe(
            tap((comment: Comment) => {
                this.comments.add(comment);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong adding a comment!`);
                return throwError(err);
            }),
        );
    }

    public editComment(commentId: string, formInfo: CommentForm) {
        return this.network.editComment(this.pseudQuery.currentId, commentId, formInfo).pipe(
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
