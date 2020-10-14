import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './watching.component.html',
  styleUrls: ['./watching.component.less']
})
export class WatchingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.WATCHING);
  }

}
