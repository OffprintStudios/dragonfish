import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './watching.component.html',
  styleUrls: ['./watching.component.less']
})
export class WatchingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.WATCHING);
  }

}
