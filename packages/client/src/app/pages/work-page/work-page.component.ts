import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../services/auth';
import { WorksService, CollectionsService, LocalSectionsService, HistoryService } from '../../services/content';
import { EditWorkComponent, UploadCoverartComponent } from '../../components/modals/works';
import { QueueService } from '../../services/admin';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AddToCollectionComponent } from '../../components/modals/collections';
import { SectionInfoViewModel } from './viewmodels/section-info.viewmodel';
import { calculateApprovalRating } from '../../util/functions';
import { History, RatingOption } from '@pulp-fiction/models/history';
import { Work, PublishSection, SetApprovalRating } from '@pulp-fiction/models/works';
import { ItemKind } from '@pulp-fiction/models/comments';
import { AlertsService } from '../../modules/alerts';
import { WorkPageData } from '../../models/site';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.less']
})
export class WorkPageComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged in user
  loading = false; // Loading check for fetching data

  workData: Work; // This work's data.  
  userHist: History; // The current user's reading history

  pageNum = 1; // For comments pages
  itemKind = ItemKind.Work; // Sets the item kind for comments

  // The sections list binds to these, as they can be mutated individually,
  // without requiring us to re-assign workData (which forces the entire section list to be rebuilt)
  get allSectionViewModels(): ReadonlyArray<SectionInfoViewModel> {
    return this.sectionsService.allSections;
  }
  get pubSectionViewModels(): ReadonlyArray<SectionInfoViewModel> {
    return this.sectionsService.publishedSections;
  }

  constructor(private authService: AuthService, private worksService: WorksService, private alertsService: AlertsService,
    public route: ActivatedRoute, private router: Router, private queueService: QueueService,
    private collsService: CollectionsService, private sectionsService: LocalSectionsService, private histService: HistoryService,
    public dialog: MatDialog) {

      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.workData = data.workData.work;
      if (data.workData.history !== null) {
        this.userHist = data.workData.history;
      }
    });
  }

  /**
   * Fetches the requisite work from the database.
   */
  private fetchData() {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('page') !== null) {
      this.pageNum = +queryParams.get('page');
    }
    
    if (this.currentUser) {
      this.collsService.fetchUserCollectionsNoPaginate().subscribe(colls => {
        this.collsService.thisUsersCollections = colls;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  /**
   * Handles page changing
   * 
   * @param event The new page
   */
  onPageChange(event: number) {
    if (event !== 1) {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate([], {relativeTo: this.route});
    }
  }

  /**
   * Checks to see if the current user is the author of this work.
   */
  currentUserIsSame() {
    if (this.workData) {
      if (this.currentUser) {
        if (this.workData.author._id === this.currentUser._id) {
          return true;
        } else {
          return false;
        }
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
        this.router.navigate(['/home/works']);
        return;
      }, err => {
        return;
      });
    } else {
      return;
    }
  }

  /**
   * Sends a request to delete a section associated with this work from the database.
   *
   * @param workId The work the section belongs to
   * @param sectionId The section itself
   */
  askDeleteSection(sectionId: string) {
    if (confirm(`Are you sure you want to delete this section? This action is irreversible.`)) {
      this.worksService.deleteSection(this.workData._id, sectionId).subscribe(() => {
        this.fetchData();
        return;
      }, err => {
        return;
      });
    }
  }

  /**
   * Sends a request to publish or unpublish the specify section.
   *
   * @param sectionId The section we're publishing or unpublishing
   * @param pubStatus The current publishing status of this section
   */
  publishSection(sectionId: string, pubStatus: boolean) {
    const newPubStatus: PublishSection = {
      oldPub: pubStatus,
      newPub: !pubStatus
    };

    this.worksService.setPublishStatusSection(this.workData._id, sectionId, newPubStatus).subscribe(() => {
      this.allSectionViewModels.find(x => x._id === sectionId).published = !pubStatus;
    });
  }

  /**
   * Opens the edit form.
   */
  openEditForm() {
    const editWorkRef = this.dialog.open(EditWorkComponent, {data: {workData: this.workData}});
    editWorkRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Opens the cover art uploader.
   */
  openCoverArtUpload() {
    const updateCoverArtRef = this.dialog.open(UploadCoverartComponent);
    updateCoverArtRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Opens the add to collections box.
   */
  openAddToCollections() {
    const addToCollsRef = this.dialog.open(AddToCollectionComponent);
    addToCollsRef.afterClosed().subscribe(() => {
      this.fetchData();
    })
  }

  /**
   * Submits a work for approval in the approval queue.
   */
  submitWorkForApproval() {
    if (this.sectionsService.publishedSections.length <= 0) {
      this.alertsService.error("Your work must contain at least one published section before it can be submitted."); 
      return;
    }
    this.queueService.submitWork(this.workData._id).subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Calculates a work's approval rating.
   * 
   * @param likes The number of likes
   * @param dislikes The number of dislikes
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }

  /**
   * Sets this user's rating as Liked.
   * 
   * @param workId This work ID
   * @param currRating The current user's rating
   */
  setLike(workId: string, currRating: RatingOption) {
    const ratingOptions: SetApprovalRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.worksService.setLike(ratingOptions).subscribe(() => {
      this.userHist.ratingOption = RatingOption.Liked;

      if (currRating === RatingOption.Disliked) {
        this.workData.stats.dislikes -= 1;
      } else {
        this.workData.stats.likes += 1;
      }
    });
  }

  /**
   * Sets this user's rating as Disliked.
   * 
   * @param workId This work ID
   * @param currRating The current user's rating
   */
  setDislike(workId: string, currRating: RatingOption) {
    const ratingOptions: SetApprovalRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.worksService.setDislike(ratingOptions).subscribe(() => {
      this.userHist.ratingOption = RatingOption.Disliked;
      
      if (currRating === RatingOption.Disliked) {
        this.workData.stats.likes -= 1;
      } else {
        this.workData.stats.dislikes += 1;
      }
    });
  }


  /**
   * Sets this user's rating as NoVote.
   * 
   * @param workId This work ID
   * @param currRating The current user's rating
   */
  setNoVote(workId: string, currRating: RatingOption) {
    const ratingOptions: SetApprovalRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.worksService.setNoVote(ratingOptions).subscribe(() => {
      this.userHist.ratingOption = RatingOption.NoVote;
      
      if (currRating === RatingOption.Liked) {
        this.workData.stats.likes -= 1;
      } else if (currRating === RatingOption.Disliked) {
        this.workData.stats.dislikes -= 1;
      }
    });
  }

}
