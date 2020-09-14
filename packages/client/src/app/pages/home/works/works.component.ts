import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

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

  loading = false;
  isUnpubFiltered = false;
  isPubFiltered = false;

  pageNum = 1;

  searchWorks = new FormGroup({
    query: new FormControl(''),
  });

  constructor(private authService: AuthService, private worksService: WorksService, 
    private queueService: QueueService, public dialog: MatDialog) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData(this.pageNum);
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
  fetchData(pageNum: number) {
    this.loading = true;
    this.worksService.fetchUserWorks(pageNum).subscribe(works => {
      this.works = works;
      this.pageNum = pageNum;
      this.loading = false;
    });
  }

  /**
   * Opens the new work form modal.
   */
  openNewWorkForm() {
    const newWorkRef = this.dialog.open(NewWorkComponent);
    newWorkRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Opens the edit work form modal.
   * 
   * @param work The work to edit
   */
  openEditWorkForm(work: Work) {
    const editWorkRef = this.dialog.open(EditWorkComponent, {data: {workData: work}});
    editWorkRef.afterClosed().subscribe(() => {
      this.fetchData(this.pageNum);
    });
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
