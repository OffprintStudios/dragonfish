import { Component, Input, OnInit } from '@angular/core';
import { Comment, EditComment } from '@dragonfish/shared/models/comments';
import { Select } from '@ngxs/store';
import { UserState } from '../../../../repo/user';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { NetworkService } from '../../../../services';

@Component({
    selector: 'dragonfish-comment-box',
    templateUrl: './comment-box.component.html',
    styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    @Input() comment: Comment;
    @Input() index: number;

    editMode = false;
    editComment = new FormGroup({
        body: new FormControl('', [Validators.minLength(10), Validators.required])
    })

    constructor(private alerts: AlertsService, private network: NetworkService) {}

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

    /**
     * Submits edits on a comment.
     *
     * @param commentId The comment we're editing
     */
    submitEdits() {
        if (this.editCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const commInfo: EditComment = {
            body: this.editCommentFields.body.value,
        };

        this.network.editComment(this.comment._id, commInfo).subscribe(() => {
            this.comment.body = this.editCommentFields.body.value;
            this.editMode = false;
        });
    }
}
