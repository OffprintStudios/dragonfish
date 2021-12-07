import { Component, OnInit } from '@angular/core';
import { BookshelvesRepository } from '@dragonfish/client/repository/content-library/bookshelves';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShelfMenuComponent } from '../../components/shelf-menu/shelf-menu.component';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-bookshelf-view',
    templateUrl: './bookshelf-view.component.html',
    styleUrls: ['./bookshelf-view.component.scss'],
})
export class BookshelfViewComponent implements OnInit {
    formIsOpen = false;
    moreMenuOpened = false;
    saving = false;

    contextMenu = ShelfMenuComponent;

    shelfForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        desc: new FormControl('', [Validators.minLength(3), Validators.maxLength(120)]),
    });

    constructor(
        public shelves: BookshelvesRepository,
        private alerts: AlertsService,
        public pseudQuery: PseudonymsQuery,
        private dialog: MatDialog,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.shelves.current$.pipe(untilDestroyed(this)).subscribe((shelf) => {
            this.shelfForm.setValue({
                name: shelf.name,
                desc: shelf.desc,
            });
        });
        setThreePartTitle(Constants.MY_LIBRARY, this.fields.name.value);
    }

    toggleForm() {
        this.formIsOpen = !this.formIsOpen;
    }

    toggleMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    toggleVisibility() {
        this.shelves.toggleVisibility(this.pseudQuery.currentId as string, this.shelves.currentId).subscribe();
    }

    deleteShelf() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((wantsToDelete: boolean) => {
                if (wantsToDelete) {
                    this.shelves
                        .deleteShelf(this.pseudQuery.currentId as string, this.shelves.currentId)
                        .subscribe(() => {
                            this.router.navigate(['/my-library']).catch((err) => console.log(err));
                            setThreePartTitle(Constants.MY_LIBRARY, Constants.PROSE_AND_POETRY);
                        });
                }
            });
    }

    submitForm() {
        if (this.fields.name.invalid) {
            this.alerts.error(`Bookshelf names must be between 3 and 32 characters long.`);
            return;
        }

        if (this.fields.desc.invalid) {
            this.alerts.error(`Descriptions must be between 3 and 120 characters long.`);
            return;
        }

        const formInfo: BookshelfForm = {
            name: this.fields.name.value,
            desc: this.fields.desc.value,
        };

        if (this.pseudQuery.currentId) {
            this.saving = true;
            this.shelves.editShelf(this.pseudQuery.currentId, this.shelves.currentId, formInfo).subscribe(() => {
                this.formIsOpen = false;
                this.saving = false;
                setThreePartTitle(Constants.MY_LIBRARY, formInfo.name);
            });
        } else {
            this.alerts.error(`You need to select a profile before you save any changes.`);
        }
    }

    private get fields() {
        return this.shelfForm.controls;
    }
}
