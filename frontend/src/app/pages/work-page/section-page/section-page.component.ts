import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/models/users';
import * as workModels from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';
import { SlugifyPipe } from 'src/app/pipes';

@Component({
  selector: 'app-section-page',
  templateUrl: './section-page.component.html',
  styleUrls: ['./section-page.component.less']
})
export class SectionPageComponent implements OnInit {
  currentUser: User;

  sectionsList: workModels.SectionInfo[];
  sectionData: workModels.Section;
  loading = false;
  editing = false;
  submitting = false;
  indexNext = 0;
  indexPrev = 0;
  currSection: workModels.SectionInfo = null;
  
  workId: string;
  workTitle: string;
  sectionNum: number;

  editSection = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    authorsNote: new FormControl('', [Validators.minLength(3), Validators.maxLength(2000)]),
  });

  constructor(private authService: AuthService, private worksService: WorksService, private cdr: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute, private slugify: SlugifyPipe) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.sectionsList = this.worksService.thisWorksPublishedSections;
      this.fetchData();
  }

  ngOnInit(): void {
  }

    /**
   * Edit form getter.
   */
  get fields() { return this.editSection.controls; }

  /**
   * Required for QuillJS editor.
   */
  triggerChangeDetection() {
    return this.cdr.detectChanges();
  }

  /**
   * Fetches the section from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.workTitle = params.get('title');
      this.route.paramMap.subscribe(routeParams => {
        this.sectionNum = +routeParams.get('sectionNum');
        this.indexNext = this.sectionNum + 1;
        this.indexPrev = this.sectionNum - 1;
        this.currSection = this.sectionsList[this.sectionNum - 1];
        this.worksService.getPublishedSection(this.workId, this.sectionsList[this.sectionNum - 1]._id).subscribe(section => {
          this.sectionData = section;
          this.loading = false;
        });
      });
    });
  }

    /**
   * Switches between the edit form and preview pane.
   */
  toggleEditForm() {
    if (this.editing === true) {
      this.editing = false;
    } else {
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
    const newEdits: workModels.EditSection = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      authorsNote: this.fields.authorsNote.value,
      oldWords: this.sectionData.stats.words,
    };

    this.worksService.editSection(this.workId, this.sectionsList[this.sectionNum - 1]._id, newEdits).subscribe(() => {
      this.editing = false;
      this.submitting = false;
      this.fetchData();
    }, () => {
      this.editing = false;
      this.submitting = false;
    });
  }

  /**
   * Asks the user if they want to go back to preview mode without saving any changes.
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
    if (confirm('Are you sure you want to delete this section? This action is irreversible.')) {
      /*this.worksService.deleteSection(workId, secId).subscribe(() => {
        this.router.navigate(['/home/works']);
      })*/
    } else {
      return;
    }
  }

  /**
   * Compares sections to see which one the currently selected one is.
   * 
   * @param secOne The first to compare
   * @param secTwo The second to compare
   */
  compareSections(secOne: workModels.SectionInfo, secTwo: workModels.SectionInfo) {
    if (secOne._id === secTwo._id) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Navigates to the next page specified by the option box.
   * 
   * @param event The section changed to
   */
  onSelectChange(event: workModels.SectionInfo) {
    const thisSectionIndex = this.sectionsList.indexOf(event);
    this.router.navigate([`/work/${this.workId}/${this.workTitle}/${thisSectionIndex + 1}/${this.slugify.transform(event.title)}`])
  }
}
