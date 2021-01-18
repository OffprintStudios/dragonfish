import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../../shared/auth';

import { Constants, Title } from '../../../shared';
import { FrontendUser } from '@pulp-fiction/models/users';
import { ReadingHistory } from '@pulp-fiction/models/reading-history';
import { PaginateResult } from '@pulp-fiction/models/util';
import { HistoryService } from '../../../services/content';
import { calculateApprovalRating } from '../../../util/functions';
import { ContentKind } from '@pulp-fiction/models/content';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
  currentUserSubscription: Subscription;
  currentUser: FrontendUser;

  histList: PaginateResult<ReadingHistory>;
  contentKind = ContentKind;

  pageNum = 1;

  constructor(private hist: HistoryService, private route: ActivatedRoute, private router: Router) {
    this.currentUserSubscription = this.currentUser$.subscribe(x => {
      this.currentUser = x;
    });

    // this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.HISTORY);
    this.route.data.subscribe(data => {
      this.histList = data.histData as PaginateResult<ReadingHistory>;
    });
  }

  /**
   * Handles page changing
   * 
   * @param event The new page
   */
  onPageChange(event: number) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    this.pageNum = event;
  }

  /**
   * Deletes a history document from a user's reading history.
   * 
   * @param histId The history document
   */
  askDelete(histId: string) {
    if (confirm(`Are you sure you want to delete this? This action cannot be reversed.`)) {
      this.hist.changeVisibility(histId).subscribe(() => {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
      });
    } else {
      return;
    }
  }

  /**
   * Checks to see if the list of history documents is empty
   */
  isHistoryEmpty() {
    if (this.histList) {
      if (this.histList.docs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Calculates the approval rating.
   * 
   * @param likes The likes on a work
   * @param dislikes The dislikes on a work
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }
}
