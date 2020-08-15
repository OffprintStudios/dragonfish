import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from 'src/app/services/auth';
import { WorksService, SectionsService } from 'src/app/services/content';
import { SlugifyPipe } from 'src/app/pipes';
import { User, Section, SectionInfo} from 'shared-models';
import { Observable } from 'rxjs';

enum SectionState {
  User,
  Author
}

@Component({
  selector: 'app-section-page',
  templateUrl: './section-page.component.html',
  styleUrls: ['./section-page.component.less']
})
export class SectionPageComponent implements OnInit {
  currentUser: User;
  currentUIState: SectionState = SectionState.User;

  loading = false; // controls the spinner above section selection boxes
  sectionSwitching: boolean = false; // controls the spinner between the section selection boxes  
  
  sectionsList: SectionInfo[];
  sectionData: Section;
  hideContents: boolean = false;
  indexNext = 0;
  indexPrev = 0;
  currSection: SectionInfo = null;
    
  workId: string;  
  workTitle: string;
  initialSectionNum: number;
  initialSectionId: string;

  // Author-mode specific properties
  editing: boolean = false;
  submitting: boolean = false;

  editorFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  editSection = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    authorsNote: new FormControl('', [Validators.minLength(3), Validators.maxLength(2000)]),
  });
  // end

  // export the enum type so Angular templates can use it
  SectionState = SectionState;

  constructor(private authService: AuthService, private worksService: WorksService,
    private router: Router, private route: ActivatedRoute, private slugify: SlugifyPipe,
    private location: Location, private sectionsService: SectionsService) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });           
      this.fetchData();
  }

  ngOnInit(): void {                    
    if (this.currentUserIsSame()) {
      this.currentUIState = SectionState.Author;
    }    
  }

  /**
   * Fetches the section from the backend.
   */
  private fetchData() {
    if (this.currentUserIsSame()) {
      this.sectionsList = this.sectionsService.allSections
    } else {
      this.sectionsList = this.sectionsService.publishedSections;
    }
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.workTitle = params.get('title');
      this.route.paramMap.subscribe(routeParams => {    
        this.sectionSwitching = true;
        this.initialSectionNum = +routeParams.get('sectionNum');
        this.initialSectionId = this.sectionsList[this.initialSectionNum - 1]._id;
        this.indexNext = this.initialSectionNum + 1;
        this.indexPrev = this.initialSectionNum - 1;
        this.currSection = this.sectionsList[this.initialSectionNum - 1];
        this.getOneSection(this.workId, this.sectionsList[this.initialSectionNum - 1]._id).subscribe(section => {
          this.sectionData = section;
          this.loading = false;
          this.sectionSwitching = false;
        });
      });
    });
  }

  /**
   * Compares sections to see which one the currently selected one is.
   * 
   * @param secOne The first to compare
   * @param secTwo The second to compare
   */
  compareSections(secOne: SectionInfo, secTwo: SectionInfo) {
    if (secOne._id === secTwo._id) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets a single section with the given ID for the given work.
   * If the current user is the author of the work, will attempt to
   * retrieve even unpublished sections. Otherwise, it will be limited
   * to published sections.
   * @param workId The ID of the work to look for the section in.
   * @param sectionId The ID of the section to look for.
   */
  getOneSection(workId: string, sectionId: string): Observable<Section> {
    return this.currentUserIsSame() 
      ? this.worksService.getSectionForUser(workId, sectionId)
      : this.worksService.getPublishedSection(workId, sectionId);    
  }

  /**
   * Navigates to the next page specified by the option box.
   * 
   * @param event The section changed to
   */
  onSelectChange(event: SectionInfo) {
    const thisSectionIndex = this.sectionsList.indexOf(event);
    this.router.navigate([`/work/${this.workId}/${this.workTitle}/${thisSectionIndex + 1}/${this.slugify.transform(event.title)}`])
  }

    /**
   * Checks to see if the currently logged in user is the same as the user who owns this section.
   */
  currentUserIsSame(): boolean {
    return this.currentUser?._id === this.sectionsService.authorId
      && this.sectionsService.authorId !== undefined
      && this.sectionsService.authorId !== null;
  }

  /* Author mode specific functions */

  /**
 * Edit form getter.
 */
  get fields() { return this.editSection.controls; }

  toggleEditForm() {

  }

  askDelete() {

  }

  submitEdits() {

  }

  askExit() {

  }

  triggerChangeDetection() {

  }

  onEditorCreated(event: any) {

  }

  /* End author mode stuff */
}
