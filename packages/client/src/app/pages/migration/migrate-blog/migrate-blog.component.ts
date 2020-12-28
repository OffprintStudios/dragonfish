import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Blog } from '@pulp-fiction/models/blogs';

@Component({
    selector: 'migrate-blog',
    templateUrl: './migrate-blog.component.html',
    styleUrls: ['./migrate-blog.component.less']
})
export class MigrateBlogComponent implements OnInit {
    myBlog: Blog;

    migrateBlogForm = new FormGroup({
        
    });

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.myBlog = this.route.snapshot.data.blogData as Blog;
    }
}