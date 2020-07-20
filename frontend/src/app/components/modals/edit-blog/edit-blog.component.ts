import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Blog } from 'src/app/models/blogs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogsService } from 'src/app/services/content';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.less']
})
export class EditBlogComponent implements OnInit {
  blogData: Blog;
  close: any;

  editBlogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    published: new FormControl(false)
  });

  constructor(private blogService: BlogsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.editBlogForm.setValue({
      title: this.blogData.title,
      body: this.blogData.body,
      published: this.blogData.published,
    });
  }

  /**
   * Required for QuillJS to work with validators.
   */
  triggerChangeDetection() {
    this.cdr.detectChanges();
  }

  /**
   * Blog form getter.
   */
  get fields() { return this.editBlogForm.controls; }

  /**
   * Submits any new edits to the blog and closes the modal if those edits are successful.
   * 
   * @param blogId The blog we're editing
   */
  submitEdits(blogId: string) {

  }

  /**
   * Asks if the users actually wants to close the form if its contents have already been changed.
   * 
   * Otherwise, it closes the form immediately.
   */
  askCancel() {
    if (this.editBlogForm.dirty) {
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
