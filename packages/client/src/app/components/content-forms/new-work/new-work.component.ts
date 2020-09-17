import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Categories, ContentRating, CreateWork, Fandoms, GenresFiction, 
  GenresPoetry, WorkStatus } from '@pulp-fiction/models/works';
import { WorksService } from '../../../services/content';

@Component({
  selector: 'new-work',
  templateUrl: './new-work.component.html',
  styleUrls: ['./new-work.component.less']
})
export class NewWorkComponent implements OnInit {
  @Input() username: string;

  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  loading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  genresList: string[] = [];

  categories = Categories; // Alias for categories
  fandoms = Fandoms; // Alias for fandoms
  genresFiction = GenresFiction; // Alias for fiction genres
  genresPoetry = GenresPoetry; // Alias for poetry genres
  rating = ContentRating; // Alias for content ratings
  status = WorkStatus; // Alias for work statuses

  newWorkForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    shortDesc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
    longDesc: new FormControl('', [Validators.required, Validators.minLength(5)]),
    thisCategory: new FormControl(null, Validators.required),
    theseFandoms: new FormControl([]),
    theseGenres: new FormControl([], Validators.required),
    rating: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  constructor(private worksService: WorksService, private snackbar: MatSnackBar) { }

  ngOnInit(): void { }

  /**
   * Getter for the new work form.
   */
  get fields() { return this.newWorkForm.controls; }

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
    if (this.newWorkForm.dirty) {
      if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        console.log('cancelled');
      } else {
        return;
      }
    } else {
      return;
    }
  }

  addGenre(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our genre
    if ((value || '').trim() && this.genresList.length < 2) {
      this.genresList.push(GenresFiction[value.trim()]);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fields.theseGenres.setValue(this.genresList);
  }

  removeGenre(genre: string): void {
    const index = this.genresList.indexOf(genre);

    if (index >= 0) {
      this.genresList.splice(index, 1);
    }
  }

  selectedGenre(event: MatAutocompleteSelectedEvent): void {
    if (this.genresList.length < 2) {
      console.log('hit!');
      this.genresList.push(GenresFiction[event.option.value]);
      this.genreInput.nativeElement.value = '';
      this.fields.theseGenres.setValue(this.genresList);
    }
  }

  debug() {
    return JSON.stringify(this.fields.theseGenres.value);
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

    if (this.fields.thisCategory.value === 'Fanfiction' && this.fields.theseFandoms.value.length < 1) {
      this.snackbar.open(`You must pick at least one fandom.`);
      this.loading = false;
      return;
    }

    if (this.fields.theseGenres.value.length < 1) {
      this.snackbar.open(`You must have at least one genre.`);
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

    // Because the genre dropdown for poetry is multipe=false, we get a
    // single string instead of an array here. Wrap it up in an array.
    const genres = Array.isArray(this.fields.theseGenres.value)
      ? this.fields.theseGenres.value
      : [this.fields.theseGenres.value];
    
    const newWork: CreateWork = {
      title: this.fields.title.value,
      shortDesc: this.fields.shortDesc.value,
      longDesc: this.fields.longDesc.value,
      category: this.fields.thisCategory.value,
      fandoms: this.fields.theseFandoms.value,
      genres: genres,
      rating: this.fields.rating.value,
      status: this.fields.status.value,
      usesNewEditor: true,
    };

    this.worksService.createWork(newWork).subscribe(() => {
      this.loading = false;
    }, err => {
      this.loading = false;
      this.snackbar.open('Something went wrong! Try again in a little bit.');
    });
  }
}
