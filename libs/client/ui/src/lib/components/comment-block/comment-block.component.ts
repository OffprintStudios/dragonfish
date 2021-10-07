import { Component, Input } from '@angular/core';
import { Comment } from '@dragonfish/shared/models/comments';
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

    private get fields() {
        return this.commentForm.controls;
    }
}
