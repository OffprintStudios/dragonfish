import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ItemKind } from '@dragonfish/shared/models/comments';
import { Select } from '@ngxs/store';
import { UserState} from '../../../repo/user';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { Comment, CreateComment, EditComment, UserInfoComments } from '@dragonfish/shared/models/comments';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NetworkService } from '../../../services';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind } from '@dragonfish/shared/models/content';
import { findIndex } from 'lodash';

@Component({
    selector: 'dragonfish-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
    @Input() itemId: string; // The ID of the content
    @Input() itemKind: ItemKind; // The kind of comments thread it is, between all content
    @Input() pageNum: number; // The requested page number
    @Input() banList?: any; // The banList of the thread
    @Output() emitPageChange = new EventEmitter<number>(); // Emits the current page number

    @ViewChild('newCommentSection') newCommentSection: ElementRef;

    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    loading = false;
    comments: PaginateResult<Comment>;

    newCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    editCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(private networkService: NetworkService, private alerts: AlertsService) {}

    ngOnInit(): void {
        this.fetchData(this.pageNum);
    }

    /**
     * Getter for the new comment form
     */
    get newCommentFields() {
        return this.newCommentForm.controls;
    }

    /**
     * Getter for the edit comment form
     */
    get editCommentFields() {
        return this.editCommentForm.controls;
    }

    /**
     * Fetches the requested page of comments.
     *
     * @param pageNum The page desired
     */
    fetchData(pageNum: number) {
        this.loading = true;
        this.networkService.fetchContentComments(this.itemId, pageNum).subscribe((comments) => {
            this.comments = comments;
            this.pageNum = pageNum;
            this.emitPageChange.emit(pageNum);
            this.loading = false;
        });
    }

    /**
     * Scrolls to the new comment form
     */
    scrollToNewCommentForm() {
        this.newCommentSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Refreshes the thread with the current page.
     */
    refreshThread() {
        this.fetchData(this.pageNum);
    }

    /**
     * Creates a new comment
     */
    submitNewComment() {
        if (this.newCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const contentKind: ContentKind =
            this.itemKind === ItemKind.Blog
                ? ContentKind.BlogContent
                : this.itemKind === ItemKind.BlogContent
                ? ContentKind.BlogContent
                : this.itemKind === ItemKind.ProseContent
                    ? ContentKind.ProseContent
                    : this.itemKind === ItemKind.PoetryContent
                        ? ContentKind.PoetryContent
                        : this.itemKind === ItemKind.NewsContent
                            ? ContentKind.NewsContent
                            : ContentKind.ProseContent;

        const comm: CreateComment = {
            body: this.newCommentFields.body.value,
            commentParentKind: contentKind,
        };

        this.networkService.addContentComment(this.itemId, comm).subscribe(() => {
            this.fetchData(this.pageNum);
        });
    }

    /**
     * Submits edits on a comment.
     *
     * @param commentId The comment we're editing
     */
    submitEdits(commentId: string) {
        if (this.editCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const commentIndex = findIndex(this.comments.docs, { _id: commentId });
        const commInfo: EditComment = {
            body: this.editCommentFields.body.value,
        };

        this.networkService.editComment(commentId, commInfo).subscribe(() => {
            this.comments.docs[commentIndex].isEditing = false;
            this.comments.docs[commentIndex].body = this.editCommentFields.body.value;
        });
    }

    /**
     * Appends a comment to the new comment form for quoting.
     *
     * @param quoteUser The user we're quoting
     * @param commentId The ID of the quoted comment
     * @param commentBody The body of the quoted comment
     */
    quoteComment(quoteUser: UserInfoComments, commentId: string, commentBody: string) {
        this.newCommentForm.setValue({
            body: `
        <blockquote>
          <em><a href="#${commentId}">${quoteUser.username}</a> said:</em>\n
          ${commentBody}
        </blockquote>
      `,
        });

        this.scrollToNewCommentForm();
    }

    /**
     * Sets the editCommentForm to the comment body requested.
     *
     * @param commentId: The comment's Id
     * @param commentBody The comment body of what we're editing
     */
    editComment(commentId: string, commentBody: string) {
        const commentIndex = findIndex(this.comments.docs, { _id: commentId });
        this.comments.docs[commentIndex].isEditing = true;

        this.editCommentForm.setValue({
            body: commentBody,
        });
    }

    /**
     * Exits editing mode without saving any changes
     *
     * @param commentId The comment's ID
     */
    exitEditing(commentId: string) {
        const commentIndex = findIndex(this.comments.docs, { _id: commentId });
        this.comments.docs[commentIndex].isEditing = false;

        this.editCommentForm.reset();
    }
}
