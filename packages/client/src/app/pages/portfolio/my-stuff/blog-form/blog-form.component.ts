import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BlogForm } from '@pulp-fiction/models/content';
import { BlogsService } from 'packages/client/src/app/services/content';

@Component({
  selector: 'pulp-fiction-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.less']
})
export class BlogFormComponent implements OnInit {

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  constructor(private blogsService: BlogsService, private location: Location, private snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  get fields() { return this.blogForm.controls; }

  submitForm() {
    if (this.fields.title.invalid) {
      return;
    }

    if (this.fields.body.invalid) {
      return;
    }

    const formData: BlogForm = {
      title: this.fields.title.value,
      body: this.fields.body.value
    };

    this.blogsService.createBlog(formData).subscribe(() => {
      this.snackBar.open(`Changes saved!`);
      this.location.back();
    });
  }
}
