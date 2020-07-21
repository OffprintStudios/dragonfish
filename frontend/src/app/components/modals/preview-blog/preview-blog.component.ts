import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogsService } from 'src/app/services/content';
import { Blog } from 'src/app/models/blogs';

@Component({
  selector: 'app-preview-blog',
  templateUrl: './preview-blog.component.html',
  styleUrls: ['./preview-blog.component.less']
})
export class PreviewBlogComponent implements OnInit {
  blogData: Blog;
  close: any;

  constructor() { }

  ngOnInit(): void {
  }
}
