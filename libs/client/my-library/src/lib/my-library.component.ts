import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';

@UntilDestroy()
@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent implements OnInit, AfterViewInit {
    @ViewChild('mainScroll') scrollbarRef: NgScrollbar;
    libraryItems: ContentLibrary[] = [];

    transparent = true;
    loading = false;

    constructor(public route: ActivatedRoute, private network: DragonfishNetworkService) {}

    ngOnInit() {
        this.fetchData();
    }

    ngAfterViewInit() {
        this.scrollbarRef.scrolled.pipe(untilDestroyed(this)).subscribe((x) => {
            this.transparent = x.target.scrollTop < 52;
        });
    }

    private fetchData() {
        this.loading = true;
        this.network.fetchLibrary().subscribe((x) => {
            this.libraryItems = x;
            this.loading = false;
        });
    }
}
