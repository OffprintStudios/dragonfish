import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { BlogForm, BlogsContentModel } from '@pulp-fiction/models/content';
import { BlogsService } from 'packages/client/src/app/services/content';
import { MyStuffService } from 'packages/client/src/app/services/user';

@Component({
  selector: 'pulp-fiction-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.less']
})
export class BlogFormComponent implements OnInit {
  currBlog: BlogsContentModel;
  editMode = false;
  createBlogMode = true;

  formTitle: string = `Create a Blog`;

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    rating: new FormControl(null, [Validators.required])
  });

  constructor(private route: ActivatedRoute, private blogsService: BlogsService, private location: Location, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const blogInfo = this.route.snapshot.data.blogData as BlogsContentModel;
    if (blogInfo) {
      this.createBlogMode = false;
      this.currBlog = blogInfo;
      this.formTitle = `Viewing "${this.currBlog.title}"`;
      this.blogForm.setValue({
        title: this.currBlog.title,
        body: this.currBlog.body
      });
    } else {
      this.createBlogMode = true;
    }
  }

  get fields() { return this.blogForm.controls; }

  switchView() {
    if (this.editMode === true) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  goBack() {
    if (this.blogForm.dirty && this.blogForm.touched) {
      if (confirm(`Are you sure you want to go back? Any unsaved changes will be lost.`)) {
        this.location.back();
      } else {
        return;
      }
    } else {
      this.location.back();
    }
  }

  submitForm() {
    if (this.blogForm.invalid) {
      this.snackBar.open(`Something's not right with the data you entered.`)
      return;
    }

    const formData: BlogForm = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      rating: this.fields.rating.value
    };

    if (this.createBlogMode) {
      this.blogsService.createBlog(formData).subscribe(() => {
        this.location.back();
      });
    } else {
      this.blogsService.editBlog(this.currBlog._id, formData).subscribe(data => {
        this.currBlog = data;
        this.blogForm.setValue({
          title: this.currBlog.title,
          body: this.currBlog.body
        });
        this.editMode = false;
      });
    }
  }
}
