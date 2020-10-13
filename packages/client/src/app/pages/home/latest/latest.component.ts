import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.less']
})
export class LatestComponent implements OnInit {
  siteVersion = GlobalConstants.siteVersion;

  constructor() {
  }

  ngOnInit(): void {
    GlobalMethods.setDefaultTitle();
  }

}
