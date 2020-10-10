import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  currentUser: FrontendUser;
  toggleForm: boolean = false;
  loadingForm: boolean = false;

  // posts: NewsDocument[];

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  constructor(/*private newsService: NewsService,*/ private authService: AuthService, public route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    // this.fetchData();
  }

  ngOnInit(): void {
  }

  toggleNewsForm() {
    if (this.toggleForm === true) {
      this.toggleForm = false;
    } else {
      this.toggleForm = true;
    }
  }

  /*private fetchData() {
    this.newsService.fetchAll().subscribe(data => {
      this.posts = data;
    });
  }*/
}
