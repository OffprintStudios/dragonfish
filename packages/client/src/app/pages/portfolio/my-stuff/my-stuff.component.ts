import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BlogsContentModel, ContentKind, ContentModel, PubStatus } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../../services/auth';
import { BlogsService } from '../../../services/content';
import { MyStuffService } from '../../../services/user';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
  currentUser: FrontendUser;
  myContent: ContentModel[];
  contentKind = ContentKind;

  itemSelected = false;
  currSelectedContent: ContentModel;

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, private authService: AuthService,
    private blogService: BlogsService) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.myContent = data.stuffData as ContentModel[];
    });
  }

  /**
   * Marks a content item as selected. If another content item is already selected, the new one will replace that one.
   * 
   * @param content The content item to select
   */
  selectItem(content: ContentModel) {
    if (this.currSelectedContent === null || this.currSelectedContent === undefined) {
      content.audit.selected = true;
      this.itemSelected = true;
      this.currSelectedContent = content;
    } else {
      if (this.currSelectedContent._id !== content._id) {
        this.currSelectedContent.audit.selected = false;
        content.audit.selected = true;
        this.itemSelected = true;
        this.currSelectedContent = content;
      } else {
        return;
      }
    }
  }

  /**
   * Deselects any currently-selected content and sets all appropriate fields to false and empty.
   */
  deselect() {
    this.currSelectedContent.audit.selected = false;
    this.itemSelected = false;
    this.currSelectedContent = null;
  }

  /**
   * Deselects any currently-selected content and navigates to the specified view page.
   * 
   * @param content The content item to view
   */
  viewContent(content: ContentModel) {
    if (content.kind === ContentKind.BlogContent) {
      this.deselect();
      this.router.navigate(['view-blog'], {relativeTo: this.route, queryParams: {contentId: content._id, kind: content.kind}, queryParamsHandling: 'merge'});
    } else if (content.kind === ContentKind.WorkContent) {
      // navigate to view work page
    }
  }

  /**
   * Sends a request to delete the currently selected content.
   * 
   * @param content The content item to delete
   */
  deleteContent(content: ContentModel) {
    if (confirm(`Are you sure you want to delete this? This action is irreversible.`)) {
      this.stuffService.deleteOne(content._id).subscribe(() => {
        this.router.navigate([], {relativeTo: this.route});
      });
    } else {
      return;
    }
  }

  /**
   * Sends a request to change the publishing status of the currently selected content. Based entirely on the content's
   * ContentKind.
   * 
   * @param content 
   */
  publishContent(content: ContentModel) {
    if (content.kind === ContentKind.BlogContent) {
      const blog = content as BlogsContentModel;
      const pubStatus: PubStatus = {
        oldStatus: blog.audit.published,
        newStatus: !blog.audit.published
      };

      this.blogService.setPublishStatus(content._id, pubStatus).subscribe(() => {
        this.router.navigate([], {relativeTo: this.route});
      });
    }
  }
}
