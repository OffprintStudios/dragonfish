import { Component, OnInit, Input } from '@angular/core';
import { Toppy, ToppyControl } from 'toppy';

import { FrontendUser } from '@pulp-fiction/models/users';
import { BlogComment, WorkComment } from '@pulp-fiction/models/comments';
import { AuthService } from '../../services/auth';
import { CommentsService } from '../../services/content';

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
    this.fetchData();
  }

  ngOnInit(): void {}

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
}
