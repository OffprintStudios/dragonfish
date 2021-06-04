import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Comment, CommentForm } from '@dragonfish/shared/models/comments';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ReplyCommentModel } from '../models';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-comment-box',
    templateUrl: './comment-box.component.html',
    styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
    @Input() comment!: Comment;
    @Input() index!: number;
    @Output() reply = new EventEmitter<ReplyCommentModel>();

    editMode = false;
    editComment = new FormGroup({
        body: new FormControl('', [Validators.minLength(10), Validators.required]),
    });

    constructor(
        private alerts: AlertsService,
        private network: DragonfishNetworkService,
        public sessionQuery: SessionQuery,
    ) {}

    ngOnInit(): void {
        this.editComment.setValue({
            body: this.comment.body,
        });
    }

    get editCommentFields() {
        return this.editComment.controls;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    replyToComment() {
        const replyOut: ReplyCommentModel = {
            quoteUser: this.comment.user as FrontendUser,
            commentId: this.comment._id,
            commentBody: this.comment.body,
        };
        this.reply.emit(replyOut);
    }

    /**
     * Submits edits on a comment.
     */
    submitEdits() {
        if (this.editCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const commInfo: CommentForm = {
            body: this.editCommentFields.body.value,
            repliesTo: [],
        };

        this.network.editComment(this.comment._id, commInfo).subscribe(() => {
            this.comment.body = this.editCommentFields.body.value;
            this.editMode = false;
        });
    }

    reportComment() {
        this.alerts.info(`This feature is not yet implemented. Check back later!`);
    }
}
