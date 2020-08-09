import { Component, OnInit } from '@angular/core';

import * as models from 'src/app/models/works';
import { BrowseService } from 'src/app/services/content/browse.service';
import { AlertsService } from 'src/app/modules/alerts';
import { HttpError } from 'src/app/models/site';
import { HttpErrorResponse } from '@angular/common/http';

type LoadingState = 'notstarted' | 'loading' | 'success' | 'failure';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less']
})
export class BrowseComponent implements OnInit {
  loadingState: LoadingState = 'notstarted';
  works: models.Work[] = [];

  constructor(private browseService: BrowseService, private alertService: AlertsService) { 
    this.fetchData();
  }

  ngOnInit(): void {        
  }

  private fetchData() {    
    this.loadingState = 'loading';    
    this.browseService.fetchAllPublishedWorks().subscribe(allWorks => {
      if (!allWorks || allWorks.length === 0) {
        this.loadingState = 'failure';
      } else {
        this.loadingState = 'success';
      }

      this.works = allWorks;
    }, (err: HttpErrorResponse) => {
      this.loadingState = 'failure';
      this.alertService.error(`Failed to retrieve stories. ${err.message}`);
    });
  }
}
