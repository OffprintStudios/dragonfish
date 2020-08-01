import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/models/users';
import { Section } from 'src/app/models/works';
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

  editSection = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    authorsNote: new FormControl('', Validators.minLength(3)),
    published: new FormControl(false),
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
   * Fetches the section from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.workId = params.get('workId');
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
        authorsNote: this.sectionData.authorsNote,
        published: this.sectionData.published
      });

      this.editing = true;
    }
  }

  submitEdits() {

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
}
