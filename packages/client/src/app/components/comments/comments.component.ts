import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as lodash from 'lodash';

import { FrontendUser, Roles } from '@pulp-fiction/models/users';
import { Comment, BlogComment, WorkComment, UserInfoComments, ItemKind, CreateComment } from '@pulp-fiction/models/comments';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../services/auth';
import { CommentsService } from '../../services/content';
import { CommentFormComponent } from './comment-form/comment-form.component';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  @Input() itemId: string; // The ID of the blog/work/newspost
  @Input() itemKind: ItemKind; // The kind of comments thread it is, between blogs/works/newsposts
  @Input() pageNum: number; // The requested page number
  @Input() banlist?: any; // The banlist of the thread
  @Output() emitPageChange = new EventEmitter<number>(); // Emits the current page number

  @ViewChild('newCommentSection') newCommentSection: ElementRef;

  currentUser: FrontendUser;
  loading = false;
  comments: PaginateResult<Comment> | PaginateResult<BlogComment> | PaginateResult<WorkComment>;

  newCommentForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(10)])
  })

  constructor(private authService: AuthService, private commentsService: CommentsService, private dialog: MatDialog) { 
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
    this.fetchData(this.pageNum);
  }

  /**
   * Getter for the new comment form
   */
  get newCommentFields() { return this.newCommentForm.controls; }

  /**
   * Fetches the requested page of comments.
   * 
   * @param pageNum The page desired
   */
  fetchData(pageNum: number) {
    this.loading = true;
    if (this.itemKind === ItemKind.Blog) {
      this.commentsService.getBlogComments(this.itemId, pageNum).subscribe(comments => {
        this.comments = comments;
        this.pageNum = pageNum;
        this.emitPageChange.emit(pageNum);
        this.loading = false;
      });
    } else if (this.itemKind === ItemKind.Work) {
      this.commentsService.getWorkComments(this.itemId, pageNum).subscribe(comments => {
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
    this.newCommentSection.nativeElement.scrollIntoView({behavior: 'smooth'});
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
    const comm: CreateComment = {
      body: this.newCommentFields.body.value
    };

    if (this.itemKind === ItemKind.Blog) {
      this.commentsService.addBlogComment(this.itemId, comm).subscribe(() => {
        this.newCommentForm.reset();
        this.fetchData(this.pageNum);
      });
    } else if (this.itemKind === ItemKind.Work) {
      this.commentsService.addWorkComment(this.itemId, comm).subscribe(() => {
        this.newCommentForm.reset();
        this.fetchData(this.pageNum);
      });
    }
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
      `
    });

    this.scrollToNewCommentForm();
  }

  /**
   * Edits a comment.
   * 
   * @param itemId The current item
   * @param itemKind The item's kind
   * @param commentId The comment's ID
   * @param commInfo The comment's info
   */
  editComment(itemId: string, itemKind: ItemKind, commentId: string, commInfo: string) {
    const commentFormRef = this.dialog.open(CommentFormComponent, {hasBackdrop: false, data: {
      itemId: itemId,
      itemKind: itemKind,
      editMode: true,
      commentId: commentId,
      editCommInfo: commInfo
    }});

    commentFormRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }
}
