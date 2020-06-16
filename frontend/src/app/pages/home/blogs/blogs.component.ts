import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
  searchBlogs = new FormGroup({
    query: new FormControl('', Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
