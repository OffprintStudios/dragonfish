import { Component, OnInit, Input } from '@angular/core';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { FrontendUser } from '@pulp-fiction/models/users';
import { BlogComment, WorkComment } from '@pulp-fiction/models/comments';
import { AuthService } from '../../services/auth';
import { CommentsService } from '../../services/content';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';

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

  currentUser: FrontendUser;
  loading = false;
  comments: BlogComment[] | WorkComment[];
  commentForm: ToppyControl;

  constructor(private authService: AuthService, private toppy: Toppy, private commentsService: CommentsService) { 
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
    this.fetchData();

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
      this.fetchData();
    });
  }

  fetchData(/*pageNum: number*/) {
    this.loading = true;
    if (this.itemKind === 'Blog') {
      this.commentsService.getBlogComments(this.itemId).subscribe(comments => {
        this.comments = comments;
        this.loading = false;
      });
    } else if (this.itemKind === 'Work') {
      this.commentsService.getWorkComments(this.itemId).subscribe(comments => {
        this.comments = comments;
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

  newComment(itemId: string, itemKind: string) {
    this.commentForm.updateContent(CommentFormComponent, {itemId: itemId, itemKind: itemKind});
    this.commentForm.open();
  }
}
