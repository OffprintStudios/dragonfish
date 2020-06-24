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

  triggerChangeDetection() {
    this.cdr.detectChanges();
  }

  get fields() { return this.newBlogForm.controls; }

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

  askCancel() {
    return;
  }
}
