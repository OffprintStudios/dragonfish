import { Component, OnInit } from '@angular/core';
import { Constants } from '@dragonfish/shared/constants';
import { slogans } from '../../models/site';
import { NetworkService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { NewsContentModel } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    rotatingSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    siteVersion = Constants.SITE_VERSION;
    loadingLatest = false;
    latestPosts: NewsContentModel[];

    constructor(private network: NetworkService, public route: ActivatedRoute) {}

    ngOnInit(): void {
        // Load the latest posts
        this.loadingLatest = true;
        this.network.fetchInitialNewsPosts().subscribe(data => {
            this.latestPosts = data;
            this.loadingLatest = false;
        }, () => {
            this.loadingLatest = false;
        });
    }
}
