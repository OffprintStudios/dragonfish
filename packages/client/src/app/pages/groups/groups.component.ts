import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../shared';
import { GlobalMethods } from '../../shared/global-methods';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.less']
})
export class GroupsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.GROUPS);
  }

}
