import { Component, OnInit } from '@angular/core';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent implements OnInit {
    formIsOpen = false;

    bookshelfForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    });

    constructor(
        public shelves: BookshelvesRepository,
        private alerts: AlertsService,
        private profiles: PseudonymsQuery,
    ) {}

    toggleForm() {
        this.formIsOpen = !this.formIsOpen;
        this.bookshelfForm.reset();
    }
    
    ngOnInit(): void {
        this.setTitle();
    }

    submitForm() {
        if (this.fields.name.invalid) {
            this.alerts.error(`Names must be at least 3 characters but no more than 32.`);
            return;
        }

        const formInfo: BookshelfForm = {
            name: this.fields.name.value,
        };

        if (this.profiles.currentId) {
            this.shelves.createShelf(this.profiles.currentId, formInfo).subscribe(() => {
                this.bookshelfForm.reset();
                this.formIsOpen = false;
            });
        } else {
            this.alerts.error(`Please select a profile before creating a bookshelf.`);
            this.bookshelfForm.reset();
            this.formIsOpen = false;
        }
    }

    setTitle() {
        setThreePartTitle(Constants.MY_LIBRARY, Constants.PROSE_AND_POETRY);
    }

    private get fields() {
        return this.bookshelfForm.controls;
    }
}
