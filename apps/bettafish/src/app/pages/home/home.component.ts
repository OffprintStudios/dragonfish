import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { slogans } from '../../models/site';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ActivatedRoute } from '@angular/router';
import { NewsContentModel } from '@dragonfish/shared/models/content';
import { delay } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
    selector: 'dragonfish-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('mainScroll') scrollbarRef: NgScrollbar;
    rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    siteVersion = Constants.SITE_VERSION;
    loadingLatest = false;
    latestPosts: NewsContentModel[];
    transparent = true;

    constructor(private network: DragonfishNetworkService, public route: ActivatedRoute) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.HOME);

        // Load the latest posts
        this.loadingLatest = true;
        this.network
            .fetchInitialNewsPosts()
            .pipe(delay(500))
            .subscribe(
                (data) => {
                    this.latestPosts = data;
                    this.loadingLatest = false;
                },
                () => {
                    this.loadingLatest = false;
                },
            );
    }

    ngAfterViewInit() {
        this.scrollbarRef.scrolled.pipe(untilDestroyed(this)).subscribe((x) => {
            this.transparent = x.target.scrollTop < 52;
        });
    }
}
