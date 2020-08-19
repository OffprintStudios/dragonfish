import { Component, OnInit } from '@angular/core';

import { User, History } from 'shared-models';
import { AuthService } from 'src/app/services/auth';
import { HistoryService } from 'src/app/services/content';
import { calculateApprovalRating } from 'src/app/util/functions';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  currentUser: User;

  histList: History[];
  loading = false;

  constructor(private authService: AuthService, private histService: HistoryService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });

    this.fetchData();
  }

  ngOnInit(): void {}

  /**
   * Fetches the history list.
   */
  private fetchData() {
    this.loading = true;
    this.histService.fetchUserHistory().subscribe(hists => {
      this.histList = hists;
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
        this.fetchData();
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
      if (this.histList.length === 0) {
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
