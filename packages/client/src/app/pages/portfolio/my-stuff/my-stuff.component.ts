import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentModel } from '@pulp-fiction/models/content';
import { MyStuffService } from '../../../services/user';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
  myContent: ContentModel[];

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.myContent = this.route.snapshot.data.stuffData as ContentModel[];
  }
}
