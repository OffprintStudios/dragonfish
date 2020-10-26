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

  itemSelected = false;
  currSelectedContent: ContentModel;

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.myContent = data.stuffData as ContentModel[];
    });
  }

  selectItem(content: ContentModel) {
    if (this.currSelectedContent === null || this.currSelectedContent === undefined) {
      content.audit.selected = true;
      this.itemSelected = true;
      this.currSelectedContent = content;
    } else {
      if (this.currSelectedContent._id !== content._id) {
        this.currSelectedContent.audit.selected = false;
        content.audit.selected = true;
        this.itemSelected = true;
        this.currSelectedContent = content;
      } else {
        return;
      }
    }
  }

  deselect() {
    this.currSelectedContent.audit.selected = false;
    this.itemSelected = false;
    this.currSelectedContent = null;
  }
}
