import { Component, Input } from '@angular/core';
import { Comment, CommentForm, CommentKind } from '@dragonfish/shared/models/comments';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { CommentsService } from '@dragonfish/client/repository/comments';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-comment-block',
    templateUrl: './comment-block.component.html',
    styleUrls: ['./comment-block.component.scss'],
})
export class CommentBlockComponent {
    @Input() createMode = false;
    @Input() comment: Comment;
    @Input() itemId: string;
    @Input() commentKind: CommentKind;

    editMode = false;

    commentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(
        public pseudQuery: PseudonymsQuery,
        private commentsService: CommentsService,
        private alerts: AlertsService,
    ) {}

    toggleEditMode = () => {
        this.editMode = !this.editMode;
        if (this.createMode) {
            this.commentForm.reset();
        }
    };

    openMultiQuote() {
        this.alerts.info(`This feature is not yet available!`);
    }

    submitForm() {
        if (this.fields.body.invalid) {
            console.log(this.fields.body.value);
            this.alerts.error(`Comments must be longer than 10 characters.`);
            return;
        }

        const form: CommentForm = {
            body: this.fields.body.value,
            repliesTo: [],
        };

        if (this.createMode) {
            this.commentsService.addComment(this.itemId, this.commentKind, form).subscribe(() => {
                this.commentForm.reset();
                this.editMode = false;
            });
        } else {
            this.commentsService.editComment(this.comment._id, form).subscribe(() => {
                this.editMode = false;
            });
        }
    }

    private get fields() {
        return this.commentForm.controls;
    }
}
