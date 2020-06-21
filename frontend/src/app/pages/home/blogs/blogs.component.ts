import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Toppy, ToppyControl } from 'toppy';

import { BlogsService } from 'src/app/services/content';
import { AuthService } from 'src/app/services/auth';
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
  searchBlogs = new FormGroup({
    query: new FormControl('', Validators.required),
  });
  filterOptions: ToppyControl;
  createEditBlog: ToppyControl;
  previewBlog: ToppyControl;

  constructor(private blogsService: BlogsService, private authService: AuthService, private toppy: Toppy) { }

  ngOnInit(): void {
  }

  
}
