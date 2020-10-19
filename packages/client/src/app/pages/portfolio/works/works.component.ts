import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Work, ApprovalStatus, Categories } from '@pulp-fiction/models/works';
import { EditWorkComponent } from '../../../components/modals/works';
import { PortWorks } from '../../../models/site';
import { QueueService } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { WorksService } from '../../../services/content';
import { Constants, Title } from '../../../shared';
import { calculateApprovalRating } from '../../../util/functions';

@Component({
    selector: 'port-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
    currentUser: FrontendUser;
    portUser: FrontendUser;
    worksData: PaginateResult<Work>
    userWorksData: PaginateResult<Work>
    pageNum = 1;

    listView = false;

    searchWorks = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
        private worksService: WorksService, private queueService: QueueService, private dialog: MatDialog) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);

        this.route.data.subscribe(data => {
            const feedData = data.feedData as PortWorks;
            this.worksData = feedData.works;
            this.userWorksData = feedData.userWorks;
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
     * Checks to see if the currently logged in user is the same as the user who owns this portfolio.
     */
    currentUserIsSame() {
        if (this.currentUser) {
            if (this.portUser) {
                if (this.currentUser._id === this.portUser._id) {
                    return true;
                } else {
                return false;
                }
            }
        }
    }

    /**
     * Switches the view
     */
    switchView() {
        if (this.listView === true) {
            this.listView = false;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        } else {
            this.listView = true;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        }
    }

    /**
     * Calculates a work's approval rating.
     * 
     * @param likes Number of likes
     * @param dislikes Number of dislikes
     */
    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }

    /**
     * Checks to see if the works array is empty.
     */
    isWorksEmpty() {
        if (this.worksData.totalDocs === 0) {
            return true;
        } else {
            return false;
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
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
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
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
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
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    });
  }

    /**
     * Searches through a user's works
     */
    searchFor() {
        return;
    }
}