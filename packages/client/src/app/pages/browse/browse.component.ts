import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Work } from '@pulp-fiction/models/works';
import { PaginateResult } from '@pulp-fiction/models/util';
import { BrowseService } from '../../services/content/browse.service';
import { AlertsService } from '../../modules/alerts';
import { calculateApprovalRating } from '../../util/functions';

import { Constants, Title } from '../../shared';

type LoadingState = 'notstarted' | 'loading' | 'success' | 'failure';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {
  loadingState: LoadingState = 'notstarted';
  works: PaginateResult<Work>;

  pageNum = 1;

  constructor(private browseService: BrowseService, private alertService: AlertsService) { 
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {      
    Title.setTwoPartTitle(Constants.BROWSE);  
  }

  /**
   * Fetches data for the browse page.
   */
  fetchData(pageNum: number) {    
    this.loadingState = 'loading';    
    this.browseService.fetchAllPublishedWorks(pageNum).subscribe(allWorks => {
      if (!allWorks || allWorks.docs.length === 0) {
        this.loadingState = 'failure';
      } else {
        this.loadingState = 'success';
        this.pageNum = pageNum;
      }

      this.works = allWorks;
    }, (err: HttpErrorResponse) => {
      this.loadingState = 'failure';
      this.alertService.error(`Failed to retrieve stories. ${err.message}`);
    });
  }

  /**
   * Calculates a work's approval rating.
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }
}
