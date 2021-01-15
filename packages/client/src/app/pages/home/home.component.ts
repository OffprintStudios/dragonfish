import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CarouselOptionsManager } from './carousel-options-manager';
import { AuthService } from '../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Constants } from '../../shared/constants';
import { Title } from '../../shared';
import { NewsContentModel } from '@pulp-fiction/models/content';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  currentUser: FrontendUser;
  siteVersion = Constants.siteVersion;

  initialPosts: NewsContentModel[];

  // Carousel Options
  newsOptions = this.carouselOptions.newsCarouselConfig;

  constructor(public route: ActivatedRoute, private auth: AuthService, private carouselOptions: CarouselOptionsManager) {
    this.auth.currUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.initialPosts = data.homeData as NewsContentModel[];
    });

    Title.setTwoPartTitle(Constants.HOME);
  }
}
