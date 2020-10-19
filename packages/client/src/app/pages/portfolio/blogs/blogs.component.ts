import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog } from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { Constants, Title } from '../../../shared';
import { PortBlogs } from '../../../models/site';

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
    listView = false;

    searchBlogs = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);

        this.route.data.subscribe(data => {
            const feedData = data.feedData as PortBlogs;
            this.blogsData = feedData.blogs;
            this.userBlogsData = feedData.userBlogs;
        });
    }

    /**
     * Handles page changing
     * 
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        this.pageNum = event;
    }

    /**
     * Checks to see if the currently logged in user is the same as the user who owns this portfolio.
     */
    currentUserIsSame() {
        if (this.currentUser) {
            if (this.portUser) {
                if (this.currentUser._id === this.portUser._id) {
                    return true;
                } else {
                return false;
                }
            }
        }
    }

    /**
     * Switches the view
     */
    switchView() {
        if (this.listView === true) {
            this.listView = false;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        } else {
            this.listView = true;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        }
    }

    /**
     * Searches for a specific blog
     */
    searchFor() {
        return;
    }
}