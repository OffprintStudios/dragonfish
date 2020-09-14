import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommentsService } from '../../../services/content';
import { CreateComment, EditComment, UserInfoComments, ItemKind } from '@pulp-fiction/models/comments';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'pulp-fiction-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.less']
})
export class CommentFormComponent implements OnInit {
  itemId: string;
  itemKind: ItemKind;

  editMode: boolean;
  editCommInfo: string;
  commentId: string;

  quoteCommUser: UserInfoComments;
  quoteCommUrl: string;
  quoteCommInfo: string;

  commentForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(10)])
  })

  constructor(private commentsService: CommentsService, private dialogRef: MatDialogRef<CommentFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      this.itemId = this.data.itemId;
      this.itemKind = this.data.itemKind;

      this.editMode = this.data.editMode;
      this.editCommInfo = this.data.editCommInfo;
      this.commentId = this.data.commentId;

      this.quoteCommUser = this.data.quoteCommUser;
      this.quoteCommUrl = this.data.quoteCommUrl;
      this.quoteCommInfo = this.data.quoteCommInfo;
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

      if (this.itemKind === ItemKind.Blog) {
        this.commentsService.addBlogComment(this.itemId, commInfo).subscribe(() => {
          this.dialogRef.close();
        });
      } else if (this.itemKind === ItemKind.Work) {
        this.commentsService.addWorkComment(this.itemId, commInfo).subscribe(() => {
          this.dialogRef.close();
        });
      }
    } else if (this.editMode === true) {
      const commInfo: EditComment = {
        body: this.fields.body.value
      };

      this.commentsService.editComment(this.commentId, commInfo).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  /**
   * Checks to see if the form is dirty and asks if a user actually wants to close it
   */
  askCancel() {
    this.dialogRef.close();
  }
}
