import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Toppy, ToppyControl } from 'toppy';

import { User } from 'src/app/models/users';
import * as models from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';
import { AlertsService } from 'src/app/modules/alerts';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
  currentUser: User;
  works: models.Work[];
  unfilteredList: models.Work[];
  newWorkForm: ToppyControl;

  loading = false;
  isUnpubFiltered = false;
  isPubFiltered = false;

  searchWorks = new FormGroup({
    query: new FormControl(''),
  });

  constructor(private authService: AuthService, private worksService: WorksService,
    private alertsService: AlertsService, private toppy: Toppy) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
  }

  /**
   * Search bar getter.
   */
  get searchField() { return this.searchWorks.controls; }

  /**
   * Fetches the list of works from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.worksService.fetchUserWorks().subscribe(works => {
      this.works = works.reverse();
      this.loading = false;
    });
  }

  /**
   * Filters the works list by published content.
   */
  filterByPublished() {
    if (this.isUnpubFiltered) {
      this.isPubFiltered = true;
      this.isUnpubFiltered = false;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === true});
    } else {
      this.unfilteredList = this.works;
      this.isPubFiltered = true;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === true});
    }
  }

  /**
   * Filters the works list by unpublished content.
   */
  filterByUnpublished() {
    if (this.isPubFiltered) {
      this.isUnpubFiltered = true;
      this.isPubFiltered = false;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === false});
    } else {
      this.unfilteredList = this.works;
      this.isUnpubFiltered = true;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === false});
    }
  }

  /**
   * Clears all filters.
   */
  clearFilter() {
    this.isPubFiltered = false;
    this.isUnpubFiltered = false;
    this.works = this.unfilteredList;
  }

  openNewWorkForm() {
    
  }

  /**
   * Checks to see if the works array is empty.
   */
  isWorksEmpty() {
    if (this.works) {
      if (this.works.length === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  openEditForm(work: models.Work) {

  }

  askDelete(workId: string) {

  }

  /**
   * Takes the inputted search value and filters the works list to contain any matching
   * search terms.
   * 
   * TODO: Make this check for equivalent text regardless of capitalization.
   */
  searchFor() {
    const query: string = this.searchField.query.value;
    if (this.isPubFiltered) {
      this.works = this.works.filter(work => {
        return work.title.includes(query);
      });
    } else if (this.isUnpubFiltered) {
      this.works = this.works.filter(work => {
        return work.title.includes(query);
      });
    } else {
      this.unfilteredList = this.works;
      this.works = this.unfilteredList.filter(work => {
        return work.title.includes(query);
      });
    }
  }
}
