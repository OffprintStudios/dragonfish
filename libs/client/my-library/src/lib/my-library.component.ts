import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent implements AfterViewInit {
    @ViewChild('mainScroll') scrollbarRef: NgScrollbar;

    transparent = true;

    constructor(public route: ActivatedRoute) {}

    ngAfterViewInit() {
        this.scrollbarRef.scrolled.pipe(untilDestroyed(this)).subscribe((x) => {
            this.transparent = x.target.scrollTop < 52;
        });
    }
}
