import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../shared/user';

import { CarouselOptionsManager } from './carousel-options-manager';
import { FrontendUser } from '@dragonfish/models/users';
import { Constants, Title } from '@dragonfish/utilities/constants';
import { NewsContentModel } from '@dragonfish/models/content';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    siteVersion = Constants.siteVersion;

    initialPosts: NewsContentModel[];

    // Carousel Options
    newsOptions = this.carouselOptions.newsCarouselConfig;

    constructor(public route: ActivatedRoute, private carouselOptions: CarouselOptionsManager) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
            this.currentUser = x;
        });
    }
    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.initialPosts = data.homeData as NewsContentModel[];
        });

        Title.setTwoPartTitle(Constants.HOME);
    }
}
