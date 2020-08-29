import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { dividerHandler, imageHandler } from '../../../../util/quill';
import { WorksService } from '../../../../services/content';
import { AlertsService } from '../../../../modules/alerts';
import { Categories, EditWork, Fandoms, GenresFiction, GenresPoetry, 
  ContentRating, WorkStatus, Work } from '@pulp-fiction/models/works';

@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.less']
})
export class EditWorkComponent implements OnInit {
  close: any; // Alias for Toppy
  workData: Work; // The work we're editing
  loading = false; // Loading check for submission

  categories = Categories; // Alias for categories
  fandoms = Fandoms; // Alias for fandoms
  genresFiction = GenresFiction; // Alias for fiction genres
  genresPoetry = GenresPoetry; // Alias for poetry genres
  rating = ContentRating; // Alias for content ratings
  status = WorkStatus; // Alias for work statuses

  editorFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'divider', 'link', 'blockquote', 'code', 'image',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered'
  ];

  editWorkForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    shortDesc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
    longDesc: new FormControl('', [Validators.required, Validators.minLength(5)]),
    thisCategory: new FormControl(null, Validators.required),
    theseFandoms: new FormControl([]),
    theseGenres: new FormControl([], Validators.required),
    rating: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  constructor(private worksService: WorksService, private cdr: ChangeDetectorRef, private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.editWorkForm.setValue({
      title: this.workData.title,
      shortDesc: this.workData.shortDesc,
      longDesc: this.workData.longDesc,
      thisCategory: this.workData.meta.category,
      theseFandoms: this.workData.meta.fandoms,
      theseGenres: this.workData.meta.genres,
      rating: this.workData.meta.rating,
      status: this.workData.meta.status
    });
  }

  /**
   * Getter for the edit work form.
   */
  get fields() { return this.editWorkForm.controls; }

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

  /**
   * Submits the edits to the backend.
   */
  submitEdits() {
    this.loading = true;

    if (this.fields.title.invalid) {
      this.alertsService.warn(`Titles must be between 3 and 100 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.shortDesc.invalid) {
      this.alertsService.warn(`Short descriptions must be between 3 and 250 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.longDesc.invalid) {
      this.alertsService.warn(`Long descriptions must be more than 5 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.thisCategory.value === null) {
      this.alertsService.warn(`You must choose a category.`);
      this.loading = false;
      return;
    }

    if (this.fields.thisCategory.value === 'Fanfiction' && this.fields.theseFandoms.value.length < 1) {
      this.alertsService.warn(`You must pick at least one fandom.`);
      this.loading = false;
      return;
    }

    if (this.fields.theseGenres.value.length < 1) {
      this.alertsService.warn(`You must have at least one genre.`);
      this.loading = false;
      return;
    }

    if (this.fields.rating.value === null) {
      this.alertsService.warn(`You must select a content rating.`);
      this.loading = false;
      return;
    }

    if (this.fields.status.value === null) {
      this.alertsService.warn(`You must select a status.`);
      this.loading = false;
      return;
    }

    // Because the genre dropdown for poetry is multipe=false, we get a
    // single string instead of an array here. Wrap it up in an array.
    const genres = Array.isArray(this.fields.theseGenres.value)
      ? this.fields.theseGenres.value
      : [this.fields.theseGenres.value];

      if (!this.workData.usesFroala) {
        // TODO: instead of sending up Quill data, send up rendered HTML
        throw new Error("Not yet implemented, fix this nonsense");
      }
    
    const newChanges: EditWork = {
      _id: this.workData._id,
      title: this.fields.title.value,
      shortDesc: this.fields.shortDesc.value,
      longDesc: this.fields.longDesc.value,
      category: this.fields.thisCategory.value,
      fandoms: this.fields.theseFandoms.value,
      genres: genres,
      rating: this.fields.rating.value,
      status: this.fields.status.value,
      usesFroala: true,
    };

    this.worksService.editWork(newChanges).subscribe(() => {
      this.loading = false;
      this.close();
    }, () => {
      this.loading = false;
      this.alertsService.error('Something went wrong! Try again in a little bit.');
    });
  }

    /**
   * Checks to see if the selected category is one of the two fiction categories.
   */
  isFiction() {
    if (this.fields.thisCategory.value === 'OriginalFiction' ||
        this.fields.thisCategory.value === 'Fanfiction') {
          return true;
        } else {
          return false;
        }
  }

  /**
   * Checks to see if the selected category is poetry
   */
  isPoetry() {
    if (this.fields.thisCategory.value === 'Poetry') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks to see if the selected category is fanfiction.
   */
  isFanfiction() {
    if (this.fields.thisCategory.value === 'Fanfiction') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Asks if the users actually wants to close the form if its contents have already been changed.
   * 
   * Otherwise, it closes the form immediately.
   */
  askCancel() {
    if (this.editWorkForm.dirty) {
      if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        this.close();
      } else {
        return;
      }
    } else {
      this.close();
      return;
    }
  }
}
