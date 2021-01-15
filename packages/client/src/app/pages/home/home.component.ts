import { Component, OnInit } from '@angular/core';

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

  constructor(private authService: AuthService, private carouselOptions: CarouselOptionsManager) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.HOME);
  }
}
