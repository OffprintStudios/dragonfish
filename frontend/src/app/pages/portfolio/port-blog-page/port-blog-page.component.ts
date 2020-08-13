import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { AuthService } from 'src/app/services/auth';
import { BlogsService, PortfolioService } from 'src/app/services/content';
import { EditBlogComponent } from 'src/app/components/modals/blogs';
import { Blog, User } from 'shared-models';

@Component({
  selector: 'app-port-blog-page',
  templateUrl: './port-blog-page.component.html',
  styleUrls: ['./port-blog-page.component.less']
})
export class PortBlogPageComponent implements OnInit {
  currentUser: User; // The currently logged-in user
  portUserId: string; // The user ID for this portfolio
  portUserName: string; // The username for this portfolio
  blogId: string; // The ID of this blog
  blogData: Blog; // The blog we're displaying
  editBlog: ToppyControl; // The blog editing form modal
  loading = false; // Loading check for fetching data

  constructor(private route: ActivatedRoute, private authService: AuthService, private portService: PortfolioService,
      private blogsService: BlogsService, private toppy: Toppy, private router: Router) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
    let position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.editBlog = this.toppy
      .position(position)
      .config({backdrop: true})
      .content(EditBlogComponent)
      .create();
    
    this.editBlog.listen('t_close').subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Fetches the blog from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(parentParams => {
      this.portUserId = parentParams.get('id');
      this.portUserName = parentParams.get('username');
      this.route.paramMap.subscribe(params => {
        this.blogId = params.get('blogId');
        this.portService.getBlog(this.blogId).subscribe(blog => {
          this.blogData = blog;
          this.loading = false;
        });
      });
    });
  }

  /**
   * Checks to see if the currently signed in user is the author of this blog.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.currentUser._id == this.blogData.author._id) {
        return true;
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
        this.router.navigate([`/portfolio/${this.portUserId}/${this.portUserName}/blog`]);
      });
    } else {
      console.log('Action cancelled.');
    }
  }

  /**
   * Opens the edit form for this blog.
   */
  openEditForm() {
    this.editBlog.updateContent(EditBlogComponent, {blogData: this.blogData});
    this.editBlog.open();
  }
}
