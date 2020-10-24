import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BlogForm } from '@pulp-fiction/models/content';

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

  constructor() { }

  ngOnInit(): void { }

  get fields() { return this.blogForm.controls; }
}
