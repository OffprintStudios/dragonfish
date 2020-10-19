import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog, SetPublishStatus } from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { Constants, Title } from '../../../shared';
import { PortBlogs } from '../../../models/site';
import { MatDialog } from '@angular/material/dialog';
import { CreateBlogComponent, EditBlogComponent, PreviewBlogComponent } from '../../../components/modals/blogs';
import { BlogsService } from '../../../services/content';

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

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private dialog: MatDialog, private blogsService: BlogsService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.BLOGS);

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
     * Switches the view between list view and gallery view via a boolean check. List view is only 
     * available for users who own this portfolio, everyone else just gets the default gallery view.
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
   * Opens the new blog form by calling on an Angular Material dialog box with the CreateBlogComponent.
   * On close, navigate to the same page as it was before so that data can be reloaded.
   */
  openNewBlogForm() {
    const createBlogRef = this.dialog.open(CreateBlogComponent);
    createBlogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    });
  }

  /**
   * Opens the edit blog form by calling on an Angular Material dialog box with the EditBlogComponent, along with a blog's data.
   * On close, navigate to the same page as it was before so that data can be reloaded.
   */
  openEditForm(blog: Blog) {
    const editBlogRef = this.dialog.open(EditBlogComponent, {data: {blogData: blog}});
    editBlogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    });
  }

  /**
   * Opens the preview blog modal by calling on an Angular Material dialog box with the PreviewBlogComponent, along with a blog's data.
   * On close, navigate to the same page as it was before so that data can be reloaded.
   */
  openPreview(blog: Blog) {
    const previewBlogRef = this.dialog.open(PreviewBlogComponent, {data: {blogData: blog}});
    previewBlogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    });
  }

  /**
   * Asks a user if they'd like to delete the specified blog. If yes, delete the blog.
   * If no, cancel the action.
   * 
   * @param blogId The blog we're deleting
   */
  askDelete(blogId: string) {
    if (confirm('Are you sure you want to delete this blog? This action is irreversible.')) {
      this.blogsService.deleteBlog(blogId).subscribe(_ => {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
        return;
      }, err => {
        console.log(err);
        return;
      });
    } else {
      return;
    }
  }

  /**
   * Sets the published status of a blog to its direct opposite. 
   * 
   * @param blogId The ID of the requisite blog
   * @param publishStatus Its publish status
   */
  setPublishStatus(blogId: string, publishStatus: boolean) {
    const pubStatus: SetPublishStatus = {blogId: blogId, publishStatus: !publishStatus};

    this.blogsService.setPublishStatus(pubStatus).subscribe(_ => {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
      return;
    }, err => {
      console.log(err);
      return;
    });
  }

    /**
     * Searches for a specific blog
     */
    searchFor() {
        return;
    }
}