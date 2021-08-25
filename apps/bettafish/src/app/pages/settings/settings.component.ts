import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { NgScrollbar } from 'ngx-scrollbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements AfterViewInit {
    @ViewChild('mainScroll') scrollbarRef: NgScrollbar;
    transparent = false;

    constructor(public sessionQuery: SessionQuery, public pseudQuery: PseudonymsQuery) {}

    ngAfterViewInit(): void {
        this.scrollbarRef.scrolled.pipe(untilDestroyed(this)).subscribe((x) => {
            this.transparent = x.target.scrollTop < 52;
        });
    }
}
