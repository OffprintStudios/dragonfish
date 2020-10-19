import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog } from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'port-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
    currentUser: FrontendUser;
    portUser: FrontendUser;
    blogsData: PaginateResult<Blog>
    userBlogsData: PaginateResult<Blog>

    pageNum = 1;

    searchBlogs = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {}

    /**
     * Searches for a specific blog
     */
    searchFor() {
        return;
    }
}