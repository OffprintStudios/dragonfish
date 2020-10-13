import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.less']
})
export class AlertsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.ALERTS);
  }

}
