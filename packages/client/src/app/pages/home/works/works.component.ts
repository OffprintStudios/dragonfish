import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { AuthService } from '../../../services/auth';
import { WorksService } from '../../../services/content';
import { NewWorkComponent, EditWorkComponent } from '../../../components/modals/works';
import { QueueService } from '../../../services/admin';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Work, ApprovalStatus, Categories } from '@pulp-fiction/models/works';
import { PaginateResult } from '@pulp-fiction/models/util';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
  currentUser: FrontendUser;
  works: PaginateResult<Work>;
  unfilteredList: Work[];
  newWorkForm: ToppyControl;
  editWorkForm: ToppyControl;

  loading = false;
  isUnpubFiltered = false;
  isPubFiltered = false;

  pageNum = 1;

  searchWorks = new FormGroup({
    query: new FormControl(''),
  });

  constructor(private authService: AuthService, private worksService: WorksService,
    private toppy: Toppy, private queueService: QueueService, public dialog: MatDialog) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData(this.pageNum);
    }

  ngOnInit(): void {
    // Initializing the new work form modal
    const newWorkPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.newWorkForm = this.toppy
      .position(newWorkPosition)
      .config({backdrop: true, closeOnEsc: true})
      .content(NewWorkComponent)
      .create();

    this.newWorkForm.listen('t_close').subscribe(() => {
      this.fetchData(1);
    });

    // Initializing the edit work form modal
    const editWorkPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.editWorkForm = this.toppy
      .position(editWorkPosition)
      .config({backdrop: true, closeOnEsc: true})
      .content(EditWorkComponent)
      .create();
    
    this.editWorkForm.listen('t_close').subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Search bar getter.
   */
  get searchField() { return this.searchWorks.controls; }

  /**
   * Fetches the list of works from the backend.
   */
  fetchData(pageNum: number) {
    this.loading = true;
    this.worksService.fetchUserWorks(pageNum).subscribe(works => {
      this.works = works;
      this.pageNum = pageNum;
      this.loading = false;
    });
  }

  /**
   * Filters the works list by published content.
   */
  filterByPublished() {
    /*if (this.isUnpubFiltered) {
      this.isPubFiltered = true;
      this.isUnpubFiltered = false;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === ApprovalStatus.Approved});
    } else {
      this.unfilteredList = this.works;
      this.isPubFiltered = true;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === ApprovalStatus.Approved});
    }*/
  }

  /**
   * Filters the works list by unpublished content.
   */
  filterByUnpublished() {
    /*if (this.isPubFiltered) {
      this.isUnpubFiltered = true;
      this.isPubFiltered = false;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === ApprovalStatus.NotSubmitted});
    } else {
      this.unfilteredList = this.works;
      this.isUnpubFiltered = true;
      this.works = this.unfilteredList.filter(work => {return work.audit.published === ApprovalStatus.NotSubmitted});
    }*/
  }

  /**
   * Clears all filters.
   */
  clearFilter() {
    /*this.isPubFiltered = false;
    this.isUnpubFiltered = false;
    this.works = this.unfilteredList;*/
  }

  /**
   * Opens the new work form modal.
   */
  openNewWorkForm() {
    this.dialog.open(NewWorkComponent);
  }

  /**
   * Opens the edit work form modal.
   * 
   * @param work The work to edit
   */
  openEditWorkForm(work: Work) {
    this.dialog.open(EditWorkComponent, {data: {thisWork: work}});
  }

  /**
   * Checks to see if the works array is empty.
   */
  isWorksEmpty() {
    if (this.works) {
      if (this.works.docs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Confirms that the user really wants to delete their work. If true, send the request
   * to the backend. If false, do nothing.
   * 
   * @param workId The ID of the work we're deleting
   */
  askDelete(workId: string) {
    if (confirm('Are you sure you want to delete this work? This action is irreversible.')) {
      this.worksService.deleteWork(workId).subscribe(() => {
        this.fetchData(this.pageNum);
        return;
      }, err => {
        console.log(err);
        return;
      });
    } else {
      return;
    }
  }

  /**
   * Returns true if the approval status of a work is Approved. Otherwise, returns false.
   * 
   * TEMPORARY FUNCTION ONLY. FUTURE UPDATE WILL INCLUDE MULTIPLE STATUS SUPPORT.
   * 
   * @param approvalStatus The work's approval status
   */
  checkStatus(approvalStatus: ApprovalStatus) {
    if (ApprovalStatus[approvalStatus] === ApprovalStatus.Approved) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Submits a work to the queue.
   * 
   * @param work The work we're submitting.
   */
  submitWorkToQueue(work: Work) {
    if (work.meta.category !== Categories.Poetry && work.stats.totWords < 750) {
      alert(`Works must have a total published word count of at least 750 words.`);
      return;
    }

    this.queueService.submitWork(work._id).subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Takes the inputted search value and filters the works list to contain any matching
   * search terms.
   * 
   * TODO: Make this check for equivalent text regardless of capitalization.
   */
  searchFor() {
    /*const query: string = this.searchField.query.value;
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
    }*/
  }
}
