import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Categories, ContentRating, CreateWork, Fandoms, Genres, GenresFiction, 
  GenresPoetry, WorkStatus, MAX_FANDOMS_PER_STORY, MAX_GENRES_PER_FICTION,
  MAX_GENRES_PER_POEM } from '@pulp-fiction/models/works';
import { WorksService } from '../../../services/content';

@Component({
  selector: 'work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.less']
})
export class WorkFormComponent implements OnInit {
  @Input() username: string;
  @Input() toggle: boolean = false;
  @Output() onSubmit = new EventEmitter<boolean>();
  @Output() onCancel = new EventEmitter<boolean>();

  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('fandomInput') fandomInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  loading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  genresList: Genres[] = [];
  fandomsList: Fandoms[] = [];

  categories = Categories; // Alias for categories
  fandoms = Fandoms; // Alias for fandoms
  genresFiction = GenresFiction; // Alias for fiction genres
  genresPoetry = GenresPoetry; // Alias for poetry genres
  rating = ContentRating; // Alias for content ratings
  status = WorkStatus; // Alias for work statuses
  
  maxFandomsPerStory = MAX_FANDOMS_PER_STORY;
  maxGenresPerFiction = MAX_GENRES_PER_FICTION;
  maxGenresPerPoem = MAX_GENRES_PER_POEM;

  workForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    shortDesc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
    longDesc: new FormControl('', [Validators.required, Validators.minLength(5)]),
    thisCategory: new FormControl(null, Validators.required),
    theseFandoms: new FormControl([]),
    theseGenres: new FormControl([], Validators.required),
    rating: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  constructor(private worksService: WorksService, private snackbar: MatSnackBar) {}

  ngOnInit(): void { }

  /**
   * Getter for the new work form.
   */
  get fields() { return this.workForm.controls; }

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
    if (this.workForm.dirty) {
      if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        this.workForm.reset();
        this.onCancel.emit(true);
        return;
      } else {
        return;
      }
    } else {
      this.workForm.reset();
      this.onCancel.emit(true);
      return;
    }
  }

  /**
   * Submits the work to the backend.
   */
  submitWork() {
    this.loading = true;
    if (this.fields.title.invalid) {
      this.snackbar.open(`Titles must be between 3 and 100 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.shortDesc.invalid) {
      this.snackbar.open(`Short descriptions must be between 3 and 250 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.longDesc.invalid) {
      this.snackbar.open(`Long descriptions must be more than 5 characters.`);
      this.loading = false;
      return;
    }

    if (this.fields.thisCategory.value === null) {
      this.snackbar.open(`You must choose a category.`);
      this.loading = false;
      return;
    }

    if (this.fields.thisCategory.value === Categories.Fanfiction) {
      if (this.fields.theseFandoms.value.length < 1) {
        this.snackbar.open(`You must pick at least one fandom.`);
        this.loading = false;
        return;
      } else if (this.fields.theseFandoms.value.length > MAX_FANDOMS_PER_STORY) {
        this.snackbar.open(`You can only have up to ${MAX_FANDOMS_PER_STORY} fandoms.`);
        this.loading = false;
        return;
      }
    }

    if (this.fields.theseGenres.value.length < 1) {
      this.snackbar.open(`You must have at least one genre.`);
      this.loading = false;
      return;
    } else if (this.fields.thisCategory.value === Categories.Poetry 
      && this.fields.theseGenres.value.length > MAX_GENRES_PER_POEM) {
      this.snackbar.open(`Poetry can only have one genre.`);
      this.loading = false;
      return;
    } else if (this.fields.theseGenres.value.length > MAX_GENRES_PER_FICTION) {
      this.snackbar.open(`You can only have up to ${MAX_GENRES_PER_FICTION} genres.`);
      this.loading = false;
      return;
    }

    if (this.fields.rating.value === null) {
      this.snackbar.open(`You must select a content rating.`);
      this.loading = false;
      return;
    }

    if (this.fields.status.value === null) {
      this.snackbar.open(`You must select a status.`);
      this.loading = false;
      return;
    }

    let fandoms: Fandoms[];
    if (this.fields.thisCategory.value === Categories.Fanfiction) {
      fandoms = this.fields.theseFandoms.value;
    } else {
      fandoms = undefined;
    }
    
    const newWork: CreateWork = {
      title: this.fields.title.value,
      shortDesc: this.fields.shortDesc.value,
      longDesc: this.fields.longDesc.value,
      category: this.fields.thisCategory.value,
      fandoms: fandoms,
      genres: this.fields.theseGenres.value,
      rating: this.fields.rating.value,
      status: this.fields.status.value,
      usesNewEditor: true,
    };

    this.worksService.createWork(newWork).subscribe(() => {
      this.loading = false;
      this.workForm.reset();
      this.onSubmit.emit(true);
    }, err => {
      this.loading = false;
      this.onSubmit.emit(false);
      this.snackbar.open('Something went wrong! Try again in a little bit.');
    });
  }
}
