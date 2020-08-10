import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { dividerHandler, imageHandler } from 'src/app/util/quill';
import { User } from 'src/app/models/users';
import { Section, EditSection } from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';

@Component({
  selector: 'app-unpublished-section-page',
  templateUrl: './unpublished-section-page.component.html',
  styleUrls: ['./unpublished-section-page.component.less']
})
export class UnpublishedSectionPageComponent implements OnInit {
  currentUser: User; // The currently logged-in user

  loading = false;
  editing = false;
  submitting = false;

  sectionData: Section;
  sectionId: string;
  workId: string;
  workTitle: string;

  editorFormats = [
    'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  editSection = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    authorsNote: new FormControl('', [Validators.minLength(3), Validators.maxLength(2000)]),
  });

  constructor(private authService: AuthService, private worksService: WorksService, private cdr: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
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
   * Gets the Quill Editor object after the editor's creation in the template HTML
   * 
   * @param event The editor object
   */
  onEditorCreated(event: any) {
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('divider', dividerHandler);
    toolbar.addHandler('image', imageHandler);
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
        this.sectionId = routeParams.get('sectionId');
        this.worksService.getSectionForUser(this.workId, this.sectionId).subscribe(section => {
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
    const newEdits: EditSection = {
      title: this.fields.title.value,
      body: this.fields.body.value,
      authorsNote: this.fields.authorsNote.value,
      oldWords: this.sectionData.stats.words,
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
    if (confirm(`Are you sure you want to delete this section? This action is irreversible.`)) {
      this.worksService.deleteSection(this.workId, this.sectionId).subscribe(() => {
        this.router.navigate([`/work/${this.workId}/${this.workTitle}`]);
        return;
      }, err => {
        console.log(err);
        return;
      });
    }
  }
}
