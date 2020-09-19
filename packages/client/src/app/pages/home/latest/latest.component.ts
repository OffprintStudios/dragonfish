import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';

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
  }

}
