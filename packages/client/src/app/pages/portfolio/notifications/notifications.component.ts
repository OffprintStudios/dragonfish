import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';

@Component({
  selector: 'port-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.NOTIFICATIONS);
  }

}
