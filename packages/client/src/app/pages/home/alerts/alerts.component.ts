import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.less']
})
export class AlertsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.ALERTS);
  }

}
