import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ProfileQuery } from './repo';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgScrollbar } from 'ngx-scrollbar';

@UntilDestroy()
@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit {
    @ViewChild('mainScroll') scrollbarRef: NgScrollbar;
    scrolled = false;

    constructor(public profileQuery: ProfileQuery) {}

    ngAfterViewInit(): void {
        this.scrollbarRef.scrolled.pipe(untilDestroyed(this)).subscribe((x) => {
            this.scrolled = !(x.target.scrollTop < 125);
        });
    }
}
