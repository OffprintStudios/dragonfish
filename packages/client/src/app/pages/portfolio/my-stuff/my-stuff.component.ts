import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentModel } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../../services/auth';
import { MyStuffService } from '../../../services/user';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
  currentUser: FrontendUser;
  myContent: ContentModel[];

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.myContent = this.route.snapshot.data.stuffData as ContentModel[];
  }
}
