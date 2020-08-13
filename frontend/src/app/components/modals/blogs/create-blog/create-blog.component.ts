import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as models from 'shared-models';
import { dividerHandler, imageHandler } from 'src/app/util/quill';
import { BlogsService } from 'src/app/services/content';
import { AlertsService } from 'src/app/modules/alerts';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.less']
})
export class CreateBlogComponent implements OnInit {
  close: any; // Alias for Toppy
  loading = false; // Loading check for submission

  newBlogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(5)]),
    published: new FormControl(false)
  });

  editorFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  constructor(private blogsService: BlogsService, private cdr: ChangeDetectorRef, private alertsService: AlertsService) {}

  ngOnInit() {}

  /**
   * Required for QuillJS validators
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

  /**
   * Create form getters
   */
  get fields() { return this.newBlogForm.controls; }

  /**
   * Submits the form as a new blog to the backend
   */
  submitForm() {
    this.loading = true;

    /* Validations */
    if (this.fields.title.invalid) {
      this.alertsService.warn(`A title must be between 3 and 100 characters in length.`);
      this.loading = false;
      return;
    }
    if (this.fields.body.invalid) {
      this.alertsService.warn(`Body text must be greater than 5 characters.`);
      this.loading = false;
      return;
    }

    /* Creation after validation */
    const newBlogInfo: models.CreateBlog = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      published: this.fields.published.value,
    };

    this.blogsService.createBlog(newBlogInfo).subscribe(() => {
      this.loading = false;
      this.close();
    }, err => {
      this.loading = false;
      this.alertsService.error(err);
    });
  }

  /**
   * Asks if the users actually wants to close the form if its contents have already been changed.
   * 
   * Otherwise, it closes the form immediately.
   */
  askCancel() {
    if (this.newBlogForm.dirty) {
      if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        this.close();
      } else {
        return;
      }
    } else {
      this.close();
      return;
    }
  }
}
