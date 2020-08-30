import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';
import * as lodash from 'lodash';

import { FrontendUser, Roles } from '@pulp-fiction/models/users';
import { Comment, BlogComment, WorkComment } from '@pulp-fiction/models/comments';
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
  @Input() itemId: string;
  @Input() itemKind: string;
  @Input() pageNum: number;
  @Input() banlist?: any;
  @Output() emitPageChange = new EventEmitter<number>();

  currentUser: FrontendUser;
  loading = false;
  comments: PaginateResult<Comment> | PaginateResult<BlogComment> | PaginateResult<WorkComment>;
  commentForm: ToppyControl;

  constructor(private authService: AuthService, private toppy: Toppy, private commentsService: CommentsService) { 
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
    this.fetchData(this.pageNum);

    // Setting up the comment form
    const pos = new GlobalPosition({
      placement: InsidePlacement.BOTTOM,
      width: '100%',
      height: 'auto'
    });

    this.commentForm = this.toppy
      .position(pos)
      .config({closeOnEsc: true})
      .content(CommentFormComponent)
      .create();

    this.commentForm.listen('t_close').subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  fetchData(pageNum: number) {
    this.loading = true;
    if (this.itemKind === 'Blog') {
      this.commentsService.getBlogComments(this.itemId, pageNum).subscribe(comments => {
        this.comments = comments;
        this.pageNum = pageNum;
        this.emitPageChange.emit(pageNum);
        this.loading = false;
      });
    } else if (this.itemKind === 'Work') {
      this.commentsService.getWorkComments(this.itemId, pageNum).subscribe(comments => {
        this.comments = comments;
        this.pageNum = pageNum;
        this.emitPageChange.emit(pageNum);
        this.loading = false;
      });
    }
  }

  currentUserIsSame(userId: string) {
    if (this.currentUser) {
      if (this.currentUser._id === userId) {
        return true;
      } else {
        return false;
      }
    }
  }

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

  newComment(itemId: string, itemKind: string) {
    this.commentForm.updateContent(CommentFormComponent, {itemId: itemId, itemKind: itemKind, editMode: false});
    this.commentForm.open();
  }

  editComment(itemId: string, itemKind: string, commentId: string, commInfo: string) {
    this.commentForm.updateContent(CommentFormComponent, {
      itemId: itemId,
      itemKind: itemKind,
      editMode: true,
      commentId: commentId,
      editCommInfo: commInfo
    });

    this.commentForm.open();
  }

  quoteComment(itemId: string, itemKind: string, commInfo: string) {
    this.commentForm.updateContent(CommentFormComponent, {
      itemId: itemId,
      itemKind: itemKind,
      editMode: false,
      quoteCommInfo: commInfo
    });

    this.commentForm.open();
  }
}
