import { Component, OnInit } from '@angular/core';
import { User } from 'shared-models';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  currentUser: User;

  constructor() { }

  ngOnInit(): void {
  }

}
