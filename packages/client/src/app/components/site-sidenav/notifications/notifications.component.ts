import { Component, OnInit } from '@angular/core';
import { ContentKind } from '@pulp-fiction/models/content';
import { NotificationBase, NotificationKind } from '@pulp-fiction/models/notifications';
import { NotificationsService } from '../../../services/user';

@Component({
  selector: 'sidenav-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  loading: boolean = false;

  unread: NotificationBase[];
  read: NotificationBase[];
  unreadTotal = 0;
  parentKind = ContentKind;

  viewRead = false;

  constructor(private notif: NotificationsService) {
    this.fetchData();
  }

  ngOnInit(): void {
  }

  switchView() {
    if (this.viewRead === true) {
      this.viewRead = false;
    } else {
      this.viewRead = true;
    }
  }

  /**
   * Fetches a user's unread notifications.
   */
  public fetchData(): void {
    this.loading = true;
    this.notif.getAllNotifications().subscribe(data => {
      this.unread = data.filter(val => { return val.read !== true });
      this.unreadTotal = this.unread.length;
      this.read = data.filter(val => { return val.read === true });
    });
  }

}
