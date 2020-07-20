import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as models from 'src/app/models/blogs';
import { BlogsService } from 'src/app/services/content';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.less']
})
export class CreateBlogComponent implements OnInit {
  close: any;

  newBlogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    body: new FormControl('', [Validators.required, Validators.minLength(5)]),
    published: new FormControl(false)
  });

  styles = {

  };

  constructor(private blogsService: BlogsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  /**
   * Required for QuillJS validators
   */
  triggerChangeDetection() {
    this.cdr.detectChanges();
  }

  /**
   * Create form getters
   */
  get fields() { return this.newBlogForm.controls; }

  /**
   * Submits the form as a new blog to the backend
   */
  submitForm() {
    const newBlogInfo: models.CreateBlog = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      published: this.fields.published.value,
    };

    this.blogsService.createBlog(newBlogInfo).subscribe(() => {
      this.close();
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
