import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { dividerHandler, imageHandler } from '../../../util/quill';

import { AuthService } from '../../../services/auth';
import { WorksService, LocalSectionsService } from '../../../services/content';
import { SlugifyPipe } from '../../../pipes';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Section, SectionInfo, EditSection} from '@pulp-fiction/models/works';
import { Observable } from 'rxjs';
import { AlertsService } from '../../../modules/alerts';
import { getQuillHtml } from '../../../util/functions';
import { SectionInfoViewModel } from '../viewmodels/section-info.viewmodel';
import { SectionKind } from '../../../services/content/local-sections.service';

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
  currentUser: FrontendUser;
  currentUIState: SectionState = SectionState.User;

  loading = false; // controls the spinner above section selection boxes
  sectionSwitching: boolean = false; // controls the spinner between the section selection boxes  
  
  sectionsList: ReadonlyArray<SectionInfoViewModel>;
  sectionData: Section;
  hideContents: boolean = false;
  indexNext = 0;
  indexPrev = 0;
  currSection: SectionInfoViewModel = null;
    
  workId: string;  
  workTitle: string;
  sectionNum: number;
  sectionId: string;

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
  // end author-mode stuff

  // export the enum type so Angular templates can use it
  SectionState = SectionState;

  constructor(private authService: AuthService, private worksService: WorksService,
    private router: Router, private route: ActivatedRoute, private slugify: SlugifyPipe,
    private sectionsService: LocalSectionsService, private alertsService: AlertsService,
    private cdr: ChangeDetectorRef) {
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
        this.sectionNum = +routeParams.get('sectionNum');
        this.sectionId = this.sectionsList[this.sectionNum - 1]._id;
        this.indexNext = this.sectionNum + 1;
        this.indexPrev = this.sectionNum - 1;
        this.currSection = this.sectionsList[this.sectionNum - 1];
        this.getOneSection(this.workId, this.sectionsList[this.sectionNum - 1]._id).subscribe(section => {
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
  onSelectChange(event: SectionInfoViewModel) {
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

  /**
   * Switches between the edit form and reading view.
   */
  toggleEditForm() {
    if (this.editing === true) {
      this.editing = false;
    } else {      
      // First, clear the contents of the Body and Author's Note. This is because
      // Quill REALLY struggles when making large changes. However, going to
      // or from an empty string is very fast.
      this.editSection.setValue({
        title: "",
        body: "",
        authorsNote: ""
      });

      this.editSection.setValue({
        title: this.sectionData.title,
        body: this.sectionData.body,
        authorsNote: this.sectionData.authorsNote
      });

      this.editing = true;
    }
  }

  /**
   * Submits the section's edits to the backend.
   */
  submitEdits() {    
    this.submitting = true;
    if (this.fields.title.invalid) {
      this.alertsService.warn(`Titles must be between 3 and 100 characters.`);
      this.submitting = false;
      return;
    }

    if (this.fields.body.invalid) {
      this.alertsService.warn(`Body text must be greater than 5 characters.`);
      this.submitting = false;
      return;
    }

    if (this.fields.authorsNote.value !== null || this.fields.authorsNote.value !== undefined) {
      if (this.fields.authorsNote.invalid) {
        this.alertsService.warn(`Author's notes must be between 5 and 2000 characters.`);
        this.submitting = false;
        return;
      }
    }

    const sectionBodyValue = this.sectionData.usesNewEditor
      ? this.fields.body.value
      : getQuillHtml(document.querySelector("quill-editor"));

    const authorsNoteValue = this.sectionData.usesNewEditor
      ? this.fields.authorsNote.value
      : getQuillHtml(document.querySelector("div.authors-note"));

    const newEdits: EditSection = {
      title: this.fields.title.value,
      body: sectionBodyValue,
      authorsNote: authorsNoteValue,
      oldWords: this.sectionData.stats.words,
      usesNewEditor: true,
    };

    this.worksService.editSection(this.workId, this.sectionId, newEdits).subscribe(() => {
      this.editing = false;
      this.submitting = false;
      this.fetchData();
    }, () => {
      this.editing = false;
      this.submitting = false;
    });
  }

  /**
   * Asks the user if they want to go back to reader mode without saving any changes.
   */
  askExit() {
    if (this.editSection.dirty || this.editSection.touched) {
      if (confirm('Are you sure? All unsaved changes will be discarded.')) {
        this.toggleEditForm();
      } else {
        console.log('Action cancelled.');
      }
    } else {
      this.toggleEditForm();
    }
  }

  /**
   * Asks the user if they would actually want to delete this section. Deletes if true.
   */
  askDelete() {
    if (confirm(`Are you sure you want to delete this section? This action is irreversible.`)) {
      this.worksService.deleteSection(this.workId, this.sectionId).subscribe(() => {
        const publishState: SectionKind = this.sectionData.published ? SectionKind.Published : SectionKind.Unpublished;
        this.sectionsService.removeSection(this.sectionId, publishState);
        this.router.navigate([`/work/${this.workId}/${this.workTitle}`]);
        return;
      }, err => {
        console.log(err);
        return;
      });
    }
  }

  /**
   * Required for the QuillJS editor.
   */
  triggerChangeDetection() {
    return this.cdr.detectChanges();
  }

  /**
   * Gets the Quill Editor object after the editor's creation in the template HTML
   * 
   * @param event The editor object
   */
  onEditorCreated(event: any) {
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('divider', dividerHandler);
    toolbar.addHandler('image', imageHandler);
  }

  /* End author mode stuff */
}
