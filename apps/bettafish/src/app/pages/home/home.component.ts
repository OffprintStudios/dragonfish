import { Component, OnInit } from '@angular/core';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { slogans } from '../../models/site';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ActivatedRoute } from '@angular/router';
import { BlogsContentModel } from '@dragonfish/shared/models/content';
import { catchError, delay, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
    selector: 'dragonfish-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    siteVersion = Constants.SITE_VERSION;
    loadingLatest = false;
    latestPosts: BlogsContentModel[];

    constructor(private network: DragonfishNetworkService, public route: ActivatedRoute) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.HOME);

        // Load the latest posts
        this.loadingLatest = true;
        this.network
            .fetchInitialNewsPosts()
            .pipe(
                delay(500),
                tap((data) => {
                    this.latestPosts = data;
                    this.loadingLatest = false;
                }),
                catchError((err) => {
                    this.loadingLatest = false;
                    return throwError(err);
                }),
            )
            .subscribe();
    }
}
