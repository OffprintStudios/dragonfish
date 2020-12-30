import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Title } from '../../../shared';
import { BlogsContentModel, SetRating } from '@pulp-fiction/models/content';
import { ReadingHistory, RatingOption } from '@pulp-fiction/models/reading-history';
import { ContentPage } from '../../../models/site';
import { ContentService, HistoryService } from '../../../services/content';

@Component({
  selector: 'app-port-blog-page',
  templateUrl: './port-blog-page.component.html',
  styleUrls: ['./port-blog-page.component.less']
})
export class PortBlogPageComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUserName: string; // The username for this portfolio
  blogData: BlogsContentModel; // The blog we're displaying
  histData: ReadingHistory; // The current user's reading history
  loading = false; // Loading check for fetching data
  pageNum = 1; // Comments page

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private hist: HistoryService,
    private contentService: ContentService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
    const params = this.route.parent.snapshot.paramMap;
    this.portUserName = params.get('username');
    this.route.data.subscribe(data => {
      const pageData = data.blogData as ContentPage;
      this.blogData = pageData.content as BlogsContentModel;
      if (pageData.history !== null) {
        this.histData = pageData.history;
      }
    });
    Title.setTwoPartTitle(this.blogData.title);
  }

  /**
   * Fetches the current page of comments.
   */
  private fetchData() {
    const queryParams = this.route.snapshot.queryParamMap;    
    if (queryParams.get('page') !== null) {
      this.pageNum = +queryParams.get('page');
    }
  }

  /**
   * Changes query params to the appropriate page.
   * @param event The page changed to
   */
  onPageChange(event: number) {
    if (event !== 1) {
      this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate([], {relativeTo: this.route});
    }
  }

    /**
    * Sets this user's rating as Liked.
    * 
    * @param workId This work ID
    * @param currRating The current user's rating
    */
   setLike(workId: string, currRating: RatingOption) {
    const ratingOptions: SetRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.contentService.setLike(ratingOptions).subscribe(() => {
      this.histData.ratingOption = RatingOption.Liked;

      if (currRating === RatingOption.Disliked) {
        this.blogData.stats.dislikes -= 1;
      } else {
        this.blogData.stats.likes += 1;
      }
    });
  }

  /**
   * Sets this user's rating as Disliked.
   * 
   * @param workId This work ID
   * @param currRating The current user's rating
   */
  setDislike(workId: string, currRating: RatingOption) {
    const ratingOptions: SetRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.contentService.setDislike(ratingOptions).subscribe(() => {
      this.histData.ratingOption = RatingOption.Disliked;

      if (currRating === RatingOption.Disliked) {
        this.blogData.stats.likes -= 1;
      } else {
        this.blogData.stats.dislikes += 1;
      }
    });
  }


  /**
   * Sets this user's rating as NoVote.
   * 
   * @param workId This work ID
   * @param currRating The current user's rating
   */
  setNoVote(workId: string, currRating: RatingOption) {
    const ratingOptions: SetRating = {
      workId: workId,
      oldApprovalRating: currRating
    };

    this.contentService.setNoVote(ratingOptions).subscribe(() => {
      this.histData.ratingOption = RatingOption.NoVote;

      if (currRating === RatingOption.Liked) {
        this.blogData.stats.likes -= 1;
      } else if (currRating === RatingOption.Disliked) {
        this.blogData.stats.dislikes -= 1;
      }
    });
  }
}
