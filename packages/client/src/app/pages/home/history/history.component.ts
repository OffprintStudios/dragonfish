import { Component, OnInit } from '@angular/core';

import { FrontendUser } from '@pulp-fiction/models/users';
import { History } from '@pulp-fiction/models/history';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { HistoryService } from '../../../services/content';
import { calculateApprovalRating } from '../../../util/functions';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  currentUser: FrontendUser;

  histList: PaginateResult<History>;
  loading = false;

  pageNum = 1;

  constructor(private authService: AuthService, private histService: HistoryService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {}

  /**
   * Fetches the history list.
   */
  fetchData(pageNum: number) {
    this.loading = true;
    this.histService.fetchUserHistory(pageNum).subscribe(hists => {
      this.histList = hists;
      this.pageNum = pageNum;
      this.loading = false;
    });
  }

  /**
   * Deletes a history document from a user's reading history.
   * 
   * @param histId The history document
   */
  askDelete(histId: string) {
    if (confirm(`Are you sure you want to delete this? This action cannot be reversed.`)) {
      this.histService.changeVisibility(histId).subscribe(() => {
        this.fetchData(this.pageNum);
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
