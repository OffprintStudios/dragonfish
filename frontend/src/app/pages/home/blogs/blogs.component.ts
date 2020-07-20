import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { BlogsService } from 'src/app/services/content';
import { AuthService } from 'src/app/services/auth';
import { CreateBlogComponent, PreviewBlogComponent, EditBlogComponent } from 'src/app/components/modals';
import { User } from 'src/app/models/users';
import { Blog, SetPublishStatus } from 'src/app/models/blogs';
import { AlertsService } from 'src/app/modules/alerts';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
  currentUser: User;
  blogs: Blog[];
  unfilteredList: Blog[];

  loading = false;
  isPubFiltered = false;
  isUnpubFiltered = false;

  searchBlogs = new FormGroup({
    query: new FormControl('', Validators.required),
  });

  createBlog: ToppyControl;
  previewBlog: ToppyControl;
  editBlog: ToppyControl;

  constructor(private blogsService: BlogsService, private authService: AuthService, private toppy: Toppy, private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
    this.fetchData();
  }

  ngOnInit(): void {
    // Creates the createBlog modal
    const createPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: 'auto',
      height: 'auto',
    });

    this.createBlog = this.toppy
      .position(createPosition)
      .config({backdrop: true, closeOnEsc: true})
      .content(CreateBlogComponent)
      .create();

    this.createBlog.listen('t_close').subscribe(() => {
      this.fetchData();
    });

    // Creates the previewBlog modal
    const previewPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: 'auto',
      height: 'auto',
    });

    this.previewBlog = this.toppy
      .position(previewPosition)
      .config({backdrop: true, closeOnEsc: true, closeOnDocClick: true})
      .content(PreviewBlogComponent)
      .create();
    
    this.previewBlog.listen('t_close').subscribe(() => {
      this.fetchData();
    });

    // Creates the editBlog modal
    const editPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: 'auto',
      height: 'auto',
    });

    this.editBlog = this.toppy
      .position(editPosition)
      .config({backdrop: true, closeOnEsc: true})
      .content(EditBlogComponent)
      .create();
  }

  /**
   * Search bar getter.
   */
  get searchField() { return this.searchBlogs.controls; }

  /**
   * Fetches the list of blogs from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.blogsService.fetchUserBlogs().subscribe(blogs => {
      this.blogs = blogs.reverse();
      this.loading = false;
    });
  }
  
  /**
   * Checks to see if the blogs array is empty.
   */
  isBlogsEmpty() {
    if (this.blogs) {
      if (this.blogs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Opens the new blog form.
   */
  openNewBlogForm() {
    this.createBlog.open();
  }

  /**
   * Opens the edit blog form.
   */
  openEditForm(blog: Blog) {
    this.editBlog.updateContent(EditBlogComponent, {blogData: blog});
    this.editBlog.open();
  }

  /**
   * Opens the blog preview.
   */
  openPreview(blog: Blog) {
    this.previewBlog.updateContent(PreviewBlogComponent, {blogData: blog});
    this.previewBlog.open();
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
        this.fetchData();
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
      this.fetchData();
      return;
    }, err => {
      console.log(err);
      this.alertsService.error('Something went wrong! Try again in a little bit.');
      return;
    });
  }

  /**
   * Filters the blogs list by published content.
   */
  filterByPublished() {
    if (this.isUnpubFiltered) {
      this.isPubFiltered = true;
      this.isUnpubFiltered = false;
      this.blogs = this.unfilteredList.filter(blog => {return blog.published === true});
    } else {
      this.unfilteredList = this.blogs;
      this.isPubFiltered = true;
      this.blogs = this.unfilteredList.filter(blog => {return blog.published === true});
    }
  }

  /**
   * Filters the blogs list by unpublished content.
   */
  filterByUnpublished() {
    if (this.isPubFiltered) {
      this.isUnpubFiltered = true;
      this.isPubFiltered = false;
      this.blogs = this.unfilteredList.filter(blog => {return blog.published === false});
    } else {
      this.unfilteredList = this.blogs;
      this.isUnpubFiltered = true;
      this.blogs = this.unfilteredList.filter(blog => {return blog.published === false});
    }
  }

  /**
   * Clears all filters.
   */
  clearFilter() {
    this.isPubFiltered = false;
    this.isUnpubFiltered = false;
    this.blogs = this.unfilteredList;
  }

  /**
   * Takes the inputted search value and filters the blogs list to contain any matching
   * search terms.
   * 
   * TODO: Make this check for equivalent text regardless of capitalization.
   */
  searchFor() {
    const query: string = this.searchField.query.value;
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
    }
  }
}
