import { Component, OnInit } from '@angular/core';
import { Constants, Title } from '../../../shared';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';

import { FrontendUser } from '@dragonfish/models/users';
import { MessageThread } from '@dragonfish/models/messages';
import { PaginateResult } from '@dragonfish/models/util';
import { MessagesService } from '../../../services/content';

@Component({
  selector: 'port-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.less']
})
export class ConversationsComponent implements OnInit {
  @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  threads: PaginateResult<MessageThread>;

  pageNum: number = 1;

  constructor(private messageService: MessagesService) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });
    // this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.INBOX);
  }

  private fetchData(pageNum: number) {
    this.messageService.fetchUserThreads(pageNum).subscribe(threads => {
      this.threads = threads;
      this.pageNum = pageNum;
    });
  }
}