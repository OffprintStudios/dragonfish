import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from 'src/app/models/users';
import { Blog } from 'shared-imports';
import { AuthService } from 'src/app/services/auth';
import { PortfolioService } from 'src/app/services/content';

@Component({
  selector: 'app-port-blog',
  templateUrl: './port-blog.component.html',
  styleUrls: ['./port-blog.component.less']
})
export class PortBlogComponent implements OnInit {
  currentUser: User; // The currently logged-in user
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  portBlogsData: Blog[]; // The list of published blogs
  loading = false; // Loading check for fetching data

  constructor(private route: ActivatedRoute, private portService: PortfolioService, private authService: AuthService) {
    this.authService.currUser.subscribe(x => {this.currentUser = x;});
    this.fetchData();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {}

  /**
   * Fetches the data for this user's published blogs list.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portUserName = params.get('username');
      this.portService.getBlogList(this.portUserId).subscribe(blogs => {
        this.portBlogsData = blogs;
        this.loading = false;
      });
    });
  }

  /**
   * Checks to see if the portBlogsData array contains blogs. Returns true if there's blogs,
   * but false otherwise.
   */
  blogsArePresent() {
    if (this.portBlogsData) {
      if (this.portBlogsData.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Truncates the body text of the blog in order to fit within the specified blog list
   * size parameters.
   * 
   * @param body The body text of the blog
   */
  truncateBody(body: string) {
    return body.substr(0, 200) + '...';
  }

  /**
   * Checks to see if the currently logged in user is the same as the one that owns this
   * portfolio.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.currentUser._id === this.portUserId) {
        return true;
      } else {
        return false;
      }
    }
  }
}
