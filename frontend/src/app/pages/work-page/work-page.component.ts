import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { User } from 'src/app/models/users';
import * as workModels from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';
import { EditWorkComponent, UploadCoverartComponent } from 'src/app/components/modals/works';
import { QueueService } from 'src/app/services/admin';
import { Decision } from 'src/app/models/admin';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.less']
})
export class WorkPageComponent implements OnInit {
  currentUser: User; // The currently logged in user
  loading = false; // Loading check for fetching data

  workId: string; // This work's ID
  workData: workModels.Work; // This work's data
  pubSections: workModels.SectionInfo[]; // This work's published sections
  editWork: ToppyControl;
  updateCoverArt: ToppyControl;

  constructor(private authService: AuthService, private worksService: WorksService,
    public route: ActivatedRoute, private router: Router, private toppy: Toppy, private queueService: QueueService) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
    // Set up the edit work modal
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.editWork = this.toppy
      .position(position)
      .config({ closeOnEsc: true, backdrop: true})
      .content(EditWorkComponent)
      .create();

    this.editWork.listen('t_close').subscribe(() => {
      this.fetchData();
    });

    // Set up the upload cover art modal
    const coverArtPosition = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.updateCoverArt = this.toppy
      .position(coverArtPosition)
      .config({closeOnEsc: true, backdrop: true})
      .content(UploadCoverartComponent)
      .create();

    this.updateCoverArt.listen('t_close').subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Fetches the requisite work from the database.
   */
  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.worksService.fetchWork(this.workId).subscribe(work => {
        this.workData = work;
        this.pubSections = work.sections.filter(section => { return section.published === true; });
        this.worksService.setSectionsList(this.pubSections);
        this.worksService.thisWorkId = this.workId;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    });
  }

  /**
   * Checks to see if the current user is the author of this work.
   */
  currentUserIsSame() {
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
        console.log(err);
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
      this.worksService.deleteSection(this.workId, sectionId).subscribe(() => {
        this.fetchData();
        return;
      }, err => {
        console.log(err);
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
    const newPubStatus: workModels.PublishSection = {
      oldPub: pubStatus,
      newPub: !pubStatus
    };

    this.worksService.setPublishStatusSection(this.workId, sectionId, newPubStatus).subscribe(() => {
      this.fetchData();
    }, () => {
      console.log(`An error has occurred.`);
    });
  }

  /**
   * Opens the edit form.
   */ 
  openEditForm() {
    this.editWork.updateContent(EditWorkComponent, { workData: this.workData });
    this.editWork.open();
  }

  /**
   * Opens the cover art uploader.
   */
  openCoverArtUpload() {
    this.updateCoverArt.open();
  }

  /**
   * Submits a work for approval in the approval queue.
   */
  submitWorkForApproval() {
    this.queueService.submitWork(this.workId).subscribe(() => {
      this.fetchData();
    });
  }
}
