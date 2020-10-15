import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.less']
})
export class LatestComponent implements OnInit {
  siteVersion = Constants.siteVersion;

  constructor() {
  }

  ngOnInit(): void {
    Title.setDefaultTitle();
  }

}
