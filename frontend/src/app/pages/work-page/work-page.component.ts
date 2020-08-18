import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { AuthService } from 'src/app/services/auth';
import { WorksService, CollectionsService, SectionsService } from 'src/app/services/content';
import { EditWorkComponent, UploadCoverartComponent } from 'src/app/components/modals/works';
import { QueueService } from 'src/app/services/admin';
import { User, PublishSection, SectionInfo, Work, } from 'shared-models';
import { AddToCollectionComponent } from 'src/app/components/modals/collections';
import { SectionInfoViewModel } from './viewmodels/section-info.viewmodel';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.less']
})
export class WorkPageComponent implements OnInit {
  currentUser: User; // The currently logged in user
  loading = false; // Loading check for fetching data

  workId: string; // This work's ID
  workData: Work; // This work's data.
  pubSections: SectionInfo[]; // This work's published sections
  editWork: ToppyControl;
  updateCoverArt: ToppyControl;
  addToCollections: ToppyControl;

  // The sections list binds to these, as they can be mutated individually,
  // without requiring us to re-assign workData (which forces the entire section list to be rebuilt)
  allSectionViewModels: SectionInfoViewModel[];
  pubSectionViewModels: SectionInfoViewModel[];

  constructor(private authService: AuthService, private worksService: WorksService,
    public route: ActivatedRoute, private router: Router, private toppy: Toppy, private queueService: QueueService,
    private collsService: CollectionsService, private sectionsService: SectionsService) {

      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    // Set up the edit work modal
    this.editWork = this.toppy
      .position(position)
      .config({closeOnDocClick: true, closeOnEsc: true, backdrop: true})
      .content(EditWorkComponent)
      .create();

    this.editWork.listen('t_close').subscribe(() => {
      this.fetchData();
    });

    // Set up the upload cover art modal
    this.updateCoverArt = this.toppy
      .position(position)
      .config({closeOnDocClick: true, closeOnEsc: true, backdrop: true})
      .content(UploadCoverartComponent)
      .create();

    this.updateCoverArt.listen('t_close').subscribe(() => {
      this.fetchData();
    });

    // Set up add to collections modal
    this.addToCollections = this.toppy
      .position(position)
      .config({closeOnDocClick: true, closeOnEsc: true, backdrop: true})
      .content(AddToCollectionComponent)
      .create();

    this.addToCollections.listen('t_close').subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Fetches the requisite work from the database.
   */
  private fetchData() {
    this.loading = true;
    this.workId = this.route.snapshot.paramMap.get('workId');        
    this.worksService.fetchWork(this.workId).subscribe(work => {
      this.workData = work;
      this.pubSections = work.sections.filter(section => { return section.published === true; });
      this.allSectionViewModels = work.sections.map(x => new SectionInfoViewModel(x));
      this.pubSectionViewModels = this.pubSections.map(x => new SectionInfoViewModel(x));
      this.worksService.thisWorkId = this.workId;
      if (this.currentUserIsSame()) {
        this.sectionsService.setInfo(this.pubSections, work.author._id, this.workData.sections);
      }  else {
        this.sectionsService.setInfo(this.pubSections, work.author._id);
      }
    }, () => {
      this.loading = false;
    });
    if (this.currentUser) {
      this.collsService.fetchUserCollections().subscribe(colls => {
        this.collsService.thisUsersCollections = colls;
        this.loading = false;
      });
    } else {
      this.loading = false;
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
    const newPubStatus: PublishSection = {
      oldPub: pubStatus,
      newPub: !pubStatus
    };

    this.worksService.setPublishStatusSection(this.workId, sectionId, newPubStatus).subscribe(() => {
      this.allSectionViewModels.find(x => x._id === sectionId).published = !pubStatus;
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
   * Opens the add to collections box.
   */
  openAddToCollections() {
    this.addToCollections.open();
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
