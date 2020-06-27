import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { BlogsService } from 'src/app/services/content';
import { AuthService } from 'src/app/services/auth';
import { CreateBlogComponent } from 'src/app/components/modals';
import { User } from 'src/app/models/users';
import { Blog } from 'src/app/models/blogs';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
  currentUser: User;
  blogs: Blog[];
  loading = false;

  searchBlogs = new FormGroup({
    query: new FormControl('', Validators.required),
  });

  filterOptions: ToppyControl;
  createBlog: ToppyControl;
  previewBlog: ToppyControl;

  constructor(private blogsService: BlogsService, private authService: AuthService, private toppy: Toppy) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
    this.fetchData();
  }

  ngOnInit(): void {
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: 'auto',
      height: 'auto',
    });

    this.createBlog = this.toppy
      .position(position)
      .config({backdrop: true, closeOnEsc: true})
      .content(CreateBlogComponent)
      .create();

    this.createBlog.listen('t_close').subscribe(() => {
      this.fetchData();
    });
  }

  private fetchData() {
    this.loading = true;
    this.blogsService.fetchUserBlogs().subscribe(blogs => {
      this.blogs = blogs.reverse();
      this.loading = false;
    });
  }

  isBlogsEmpty() {
    if (this.blogs) {
      if (this.blogs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  openNewBlogForm() {
    this.createBlog.open();
  }

  askDelete(blogId: string) {
    if (confirm('Are you sure you want to delete this blog? This action is irreversible.')) {
      // TODO: Implement blog deletion both server side and client side.
      return;
    }
  }
}
