import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {
  currentUser: FrontendUser;

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }

}
