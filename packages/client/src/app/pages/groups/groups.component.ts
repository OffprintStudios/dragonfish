import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../shared';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.less']
})
export class GroupsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.GROUPS);
  }

}
