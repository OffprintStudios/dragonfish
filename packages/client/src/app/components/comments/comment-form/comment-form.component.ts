import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommentsService } from '../../../services/content';
import { AlertsService } from '../../../modules/alerts';
import { CreateComment, EditComment, UserInfoComments } from '@pulp-fiction/models/comments';

@Component({
  selector: 'pulp-fiction-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.less']
})
export class CommentFormComponent implements OnInit {
  close: any;

  itemId: string;
  itemKind: string;

  editMode: boolean;
  editCommInfo: string;
  commentId: string;

  quoteCommUser: UserInfoComments;
  quoteCommUrl: string;
  quoteCommInfo: string;

  commentForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(10)])
  })

  constructor(private commentsService: CommentsService, private alertsService: AlertsService) {
  }

  ngOnInit(): void {
    if (this.editMode === true) {
      this.commentForm.setValue({
        body: this.editCommInfo
      });
    } else if (this.quoteCommInfo && this.quoteCommUser && this.quoteCommUrl) {
      this.commentForm.setValue({
        body: `
          <blockquote>
            <em><a href="#${this.quoteCommUrl}">${this.quoteCommUser.username}</a> said:</em>\n
            ${this.quoteCommInfo}
          </blockquote>
        `
      });
    }
  }

  /**
   * Comment form field getter.
   */
  get fields() { return this.commentForm.controls; }

  submitComment() {
    if (this.editMode === false) {
      const commInfo: CreateComment = {
        body: this.fields.body.value
      };

      if (this.itemKind === 'Blog') {
        this.commentsService.addBlogComment(this.itemId, commInfo).subscribe(() => {
          this.close();
        });
      } else if (this.itemKind === 'Work') {
        this.commentsService.addWorkComment(this.itemId, commInfo).subscribe(() => {
          this.close();
        });
      }
    } else if (this.editMode === true) {
      const commInfo: EditComment = {
        body: this.fields.body.value
      };

      this.commentsService.editComment(this.commentId, commInfo).subscribe(() => {
        this.close();
      });
    }
  }

  /**
   * Checks to see if the form is dirty and asks if a user actually wants to close it
   */
  askCancel() {
    this.close();
  }
}
