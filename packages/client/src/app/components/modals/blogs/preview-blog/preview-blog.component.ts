import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Blog } from '@pulp-fiction/models/blogs';

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
