import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { BlogsService } from '../../../services/content';
import { AuthService } from '../../../services/auth';
import { CreateBlogComponent, PreviewBlogComponent, EditBlogComponent } from '../../../components/modals/blogs';
import { AlertsService } from '../../../modules/alerts';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Blog, SetPublishStatus } from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
  currentUser: FrontendUser;
  paginatedBlogs: PaginateResult<Blog>;

  loading = false;

  pageNum = 1;

  searchBlogs = new FormGroup({
    query: new FormControl('', Validators.required),
  });

  constructor(private blogsService: BlogsService, private authService: AuthService,
      private alertsService: AlertsService, private dialog: MatDialog) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
    this.fetchData(1);
  }

  ngOnInit(): void {
  }

  /**
   * Search bar getter.
   */
  get searchField() { return this.searchBlogs.controls; }

  /**
   * Fetches the list of blogs from the backend.
   */
  fetchData(pageNum: number) {
    this.loading = true;
    this.blogsService.fetchUserBlogs(pageNum).subscribe(paginatedBlogs => {
      this.paginatedBlogs = paginatedBlogs;
      this.pageNum = pageNum;
      this.loading = false;
    });
  }
  
  /**
   * Checks to see if the blogs array is empty.
   */
  isBlogsEmpty() {
    if (this.paginatedBlogs) {
      if (this.paginatedBlogs.docs) {
        if (this.paginatedBlogs.docs.length === 0) {
          return true;
        } else {
          return false;
        }
      } 
    }
  }

  /**
   * Opens the new blog form.
   */
  openNewBlogForm() {
    const createBlogRef = this.dialog.open(CreateBlogComponent);
    createBlogRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Opens the edit blog form.
   */
  openEditForm(blog: Blog) {
    const editBlogRef = this.dialog.open(EditBlogComponent, {data: {blogData: blog}});
    editBlogRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Opens the blog preview.
   */
  openPreview(blog: Blog) {
    const previewBlogRef = this.dialog.open(PreviewBlogComponent, {data: {blogData: blog}});
    previewBlogRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
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
        this.fetchData(this.pageNum);
        return;
      }, err => {
        console.log(err);
        this.alertsService.error('Something went wrong! Try again in a little bit.');
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
      this.fetchData(this.pageNum);
      return;
    }, err => {
      console.log(err);
      this.alertsService.error('Something went wrong! Try again in a little bit.');
      return;
    });
  }

  /**
   * Takes the inputted search value and filters the blogs list to contain any matching
   * search terms.
   * 
   * TODO: Make this check for equivalent text regardless of capitalization.
   */
  searchFor() {
    /*const query: string = this.searchField.query.value;
    if (this.isPubFiltered) {
      this.blogs = this.blogs.filter(blog => {
        return blog.title.includes(query);
      });
    } else if (this.isUnpubFiltered) {
      this.blogs = this.blogs.filter(blog => {
        return blog.title.includes(query);
      });
    } else {
      this.unfilteredList = this.blogs;
      this.blogs = this.unfilteredList.filter(blog => {
        return blog.title.includes(query);
      });
    }*/
  }
}
