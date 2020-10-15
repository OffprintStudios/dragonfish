import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../../services/auth';
import { BlogsService, PortfolioService } from '../../../services/content';
import { EditBlogComponent } from '../../../components/modals/blogs';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog } from '@pulp-fiction/models/blogs';
import { ItemKind } from '@pulp-fiction/models/comments';

import { Title } from '../../../shared';

@Component({
  selector: 'app-port-blog-page',
  templateUrl: './port-blog-page.component.html',
  styleUrls: ['./port-blog-page.component.less']
})
export class PortBlogPageComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUserName: string; // The username for this portfolio
  blogData: Blog; // The blog we're displaying
  loading = false; // Loading check for fetching data
  pageNum = 1; // Comments page
  itemKind = ItemKind.Blog;

  constructor(private route: ActivatedRoute, private authService: AuthService, private portService: PortfolioService,
      private blogsService: BlogsService, private dialog: MatDialog, private router: Router) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
    const params = this.route.parent.snapshot.paramMap;
    this.portUserName = params.get('username');
    this.blogData = this.route.snapshot.data.blogData as Blog;
    Title.setTwoPartTitle(this.blogData.title);
  }

  /**
   * Fetches the blog from the backend.
   */
  private fetchData() {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('page') !== null) {
      this.pageNum = +queryParams.get('page');
    }
  }

  /**
   * Changes query params to the appropriate page.
   * @param event The page changed to
   */
  onPageChange(event: number) {
    if (event !== 1) {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate([], {relativeTo: this.route});
    }
  }

  /**
   * Checks to see if the currently signed in user is the author of this blog.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.blogData) {
        if (this.currentUser._id === this.blogData.author._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Confirms if the user really wants to delete this blog.
   */
  askDelete() {
    if (confirm('Are you sure you want to delete this blog?\nThis action is irreversible.')) {
      this.blogsService.deleteBlog(this.blogData._id).subscribe(() => {
        this.router.navigate([`/portfolio/${this.blogData.author._id}/${this.portUserName}/blog`]);
      });
    } else {
      console.log('Action cancelled.');
    }
  }

  /**
   * Opens the edit form for this blog.
   */
  openEditForm() {
    const dialogRef = this.dialog.open(EditBlogComponent, {data: {blogData: this.blogData}});
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }
}
