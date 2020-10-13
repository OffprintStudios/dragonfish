import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

import { FrontendUser } from '@pulp-fiction/models/users';
import { MessageThread } from '@pulp-fiction/models/messages';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { MessagesService } from '../../../services/content';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.less']
})
export class InboxComponent implements OnInit {
  currentUser: FrontendUser;
  threads: PaginateResult<MessageThread>;

  pageNum: number = 1;

  constructor(private authService: AuthService, private messageService: MessagesService) {
    this.authService.currUser.subscribe(x => {this.currentUser = x;});
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.INBOX);
  }

  private fetchData(pageNum: number) {
    this.messageService.fetchUserThreads(pageNum).subscribe(threads => {
      this.threads = threads;
      this.pageNum = pageNum;
    });
  }
}
