import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Blog } from '@pulp-fiction/models/blogs';

@Component({
  selector: 'app-preview-blog',
  templateUrl: './preview-blog.component.html',
  styleUrls: ['./preview-blog.component.less']
})
export class PreviewBlogComponent implements OnInit {
  blogData: Blog;

  constructor(private dialogRef: MatDialogRef<PreviewBlogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.blogData = this.data.blogData;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
