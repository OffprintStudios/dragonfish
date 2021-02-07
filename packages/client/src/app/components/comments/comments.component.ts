import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select } from '@ngxs/store';
import { UserState } from '../../shared/user';
import { Observable, Subscription } from 'rxjs';
import * as lodash from 'lodash';

import { FrontendUser, Roles } from '@dragonfish/models/users';
import {
    Comment,
    BlogComment,
    WorkComment,
    UserInfoComments,
    ItemKind,
    CreateComment,
    EditComment,
} from '@dragonfish/models/comments';
import { PaginateResult } from '@dragonfish/models/util';
import { NetworkService } from '../../services';
import { ContentKind } from '@dragonfish/models/content';

@Component({
    selector: 'comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.less'],
})
export class CommentsComponent implements OnInit {
    @Input() itemId: string; // The ID of the blog/work/newspost
    @Input() itemKind: ItemKind; // The kind of comments thread it is, between blogs/works/newsposts
    @Input() pageNum: number; // The requested page number
    @Input() banlist?: any; // The banlist of the thread
    @Output() emitPageChange = new EventEmitter<number>(); // Emits the current page number

    @ViewChild('newCommentSection') newCommentSection: ElementRef;

    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;
    loading = false;
    comments: PaginateResult<Comment> | PaginateResult<BlogComment> | PaginateResult<WorkComment>;

    newCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    editCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(private networkService: NetworkService, private snackbar: MatSnackBar) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }

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
        if (this.itemKind === ItemKind.Blog) {
            this.networkService.fetchBlogComments(this.itemId, pageNum).subscribe((comments) => {
                this.comments = comments;
                this.pageNum = pageNum;
                this.emitPageChange.emit(pageNum);
                this.loading = false;
            });
        } else if (this.itemKind === ItemKind.Work) {
            this.networkService.fetchWorkComments(this.itemId, pageNum).subscribe((comments) => {
                this.comments = comments;
                this.pageNum = pageNum;
                this.emitPageChange.emit(pageNum);
                this.loading = false;
            });
        } /* Presuming this comments component lives on piece of new-Content: */ else {
            this.networkService.fetchContentComments(this.itemId, pageNum).subscribe((comments) => {
                this.comments = comments;
                this.pageNum = pageNum;
                this.emitPageChange.emit(pageNum);
                this.loading = false;
            });
        }
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
     * If there's a logged-in user, check to see if the user owns the specific comment requested.
     *
     * @param userId The user ID of the comment
     */
    currentUserIsSame(userId: string) {
        if (this.currentUser) {
            if (this.currentUser._id === userId) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Checks to see what toplevel role a user has to display the appropriate tag.
     *
     * @param roles A comment user's roles
     */
    determineProminentRole(roles: Roles[]) {
        // this will totally need retooling to figure out a much better way to verify what the top-level
        // role is
        const hasAdmin = lodash.intersection([Roles.Admin], roles);
        const hasModerator = lodash.intersection([Roles.Moderator], roles);
        const hasChatModerator = lodash.intersection([Roles.ChatModerator], roles);
        const hasContributor = lodash.intersection([Roles.Contributor], roles);
        const hasWorkApprover = lodash.intersection([Roles.WorkApprover], roles);
        const hasVIP = lodash.intersection([Roles.VIP], roles);
        const hasSupporter = lodash.intersection([Roles.Supporter], roles);

        if (hasAdmin.length > 0) {
            return Roles.Admin;
        } else if (hasModerator.length > 0) {
            return Roles.Moderator;
        } else if (hasChatModerator.length > 0) {
            return Roles.ChatModerator;
        } else if (hasContributor.length > 0) {
            return Roles.Contributor;
        } else if (hasWorkApprover.length > 0) {
            return Roles.WorkApprover;
        } else if (hasVIP.length > 0) {
            return Roles.VIP;
        } else if (hasSupporter.length > 0) {
            return Roles.Supporter;
        } else {
            return Roles.User;
        }
    }

    /**
     * Creates a new comment
     */
    submitNewComment() {
        if (this.newCommentFields.body.invalid) {
            this.snackbar.open('Comments must be at least 10 characters long.');
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

        if (this.itemKind === ItemKind.Blog) {
            this.networkService.addBlogComment(this.itemId, comm).subscribe(() => {
                this.newCommentForm.reset();
                this.fetchData(this.pageNum);
            });
        } else if (this.itemKind === ItemKind.Work) {
            this.networkService.addWorkComment(this.itemId, comm).subscribe(() => {
                this.newCommentForm.reset();
                this.fetchData(this.pageNum);
            });
        } /* Presuming this comment is being made on a piece of new-Content  */ else {
            this.networkService.addContentComment(this.itemId, comm).subscribe(() => {
                this.fetchData(this.pageNum);
            });
        }
    }

    /**
     * Submits edits on a comment.
     *
     * @param commentId The comment we're editing
     */
    submitEdits(commentId: string) {
        if (this.editCommentFields.body.invalid) {
            this.snackbar.open('Comments must be at least 10 characters long.');
            return;
        }

        const commentIndex = lodash.findIndex(this.comments.docs, { _id: commentId });
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
        const commentIndex = lodash.findIndex(this.comments.docs, { _id: commentId });
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
        const commentIndex = lodash.findIndex(this.comments.docs, { _id: commentId });
        this.comments.docs[commentIndex].isEditing = false;

        this.editCommentForm.reset();
    }
}
