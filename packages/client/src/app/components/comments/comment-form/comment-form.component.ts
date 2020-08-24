import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommentsService } from '../../../services/content';
import { AlertsService } from '../../../modules/alerts';
import { imageHandler, dividerHandler, quoteComment } from '../../../util/quill';
import { CreateComment, EditComment } from '@pulp-fiction/models/comments';

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

  quoteCommInfo: string;

  public styles = {
    'height': '200px',
    'box-shadow': 'none',
    'margin-bottom': '0'
  };

  editorFormats = [
    'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image', 'video',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  commentForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(10)])
  })

  constructor(private commentsService: CommentsService, private alertsService: AlertsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.editMode === true) {
      this.commentForm.setValue({
        body: this.editCommInfo
      });
    }

    if (this.quoteCommInfo) {
      quoteComment(this.quoteCommInfo);
      /*this.commentForm.setValue({
        body: quoteComment(this.quoteCommInfo)
      });*/
    }
  }

  /**
   * Comment form field getter.
   */
  get fields() { return this.commentForm.controls; }

  /**
   * Required for the QuillJS editor.
   */
  triggerChangeDetection() {
    this.cdr.detectChanges();
  }

  /**
   * Gets the Quill Editor object after the editor's creation in the template HTML
   * 
   * @param event The editor object
   */
  onEditorCreated(event: any) {
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('divider', dividerHandler);
    toolbar.addHandler('image', imageHandler);
  }

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
