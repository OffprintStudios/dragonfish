import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentKind, ContentModel, PubChange, PubStatus } from '@pulp-fiction/models/content';
import { FrontendUser, UserInfo } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';
import { BlogsService } from '../../services/content';
import { MyStuffService } from '../../services/user';
import { ContentItem } from './viewmodels';
import { Constants, Title } from '../../shared';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
  currentUser: FrontendUser;
  myContent: ContentItem[];
  contentKind = ContentKind;
  pubStatus = PubStatus;

  itemSelected = false;
  currSelectedContent: ContentItem;

  isIconView = true;

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, private authService: AuthService,
    private blogService: BlogsService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.myContent = data.stuffData as ContentItem[];
    });

    Title.setTwoPartTitle(Constants.MY_STUFF);
  }

  /**
   * Marks a content item as selected. If another content item is already selected, the new one will replace that one.
   * 
   * @param content The content item to select
   */
  selectItem(content: ContentItem) {
    if (this.currSelectedContent === null || this.currSelectedContent === undefined) {
      content.selected = true;
      this.itemSelected = true;
      this.currSelectedContent = content;
    } else {
      if (this.currSelectedContent._id !== content._id) {
        this.currSelectedContent.selected = false;
        content.selected = true;
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
    this.currSelectedContent.selected = false;
    this.itemSelected = false;
    this.currSelectedContent = null;
  }

  /**
   * Deselects any currently-selected content and navigates to the specified view page.
   * 
   * @param content The content item to view
   */
  viewContent(content: ContentModel) {
    this.deselect();
    if (content.kind === ContentKind.BlogContent) {
      this.router.navigate(['view-blog'], {relativeTo: this.route, queryParams: {contentId: content._id, kind: content.kind}, queryParamsHandling: 'merge'});
    } else if (content.kind === ContentKind.ProseContent) {
      this.router.navigate(['view-prose'], {relativeTo: this.route, queryParams: {contentId: content._id, kind: content.kind}, queryParamsHandling: 'merge'});
    } else if (content.kind === ContentKind.PoetryContent) {
      this.router.navigate(['view-poetry'], {relativeTo: this.route, queryParams: {contentId: content._id, kind: content.kind}, queryParamsHandling: 'merge'});
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
        this.deselect();
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
      let pubChange = {};
      if (content.audit.published === PubStatus.Published) {
        pubChange = {
          oldStatus: PubStatus.Published,
          newStatus: PubStatus.Unpublished
        };
      } else if (content.audit.published === PubStatus.Unpublished) {
        pubChange = {
          oldStatus: PubStatus.Unpublished,
          newStatus: PubStatus.Published
        };
      }

      console.log(pubChange);

      this.blogService.changePublishStatus(content._id, pubChange as PubChange).subscribe(() => {
        content.audit.published = this.pubStatus.Published;
      });
    } else if (content.kind === ContentKind.ProseContent || content.kind === ContentKind.PoetryContent) {
      if (content.kind === ContentKind.ProseContent && content.stats.words < 750) {
        this.snackBar.open(`Prose must have a minimum of 750 words in total before submitting to the queue.`);
        return;
      }

      this.stuffService.publishOne(content._id).subscribe(() => {
        content.audit.published = this.pubStatus.Pending;
      });
    }
  }

  getLink(content: ContentModel, titleSlug: string, authorSlug: string) {
    if (content.audit.published !== PubStatus.Published) {
      this.snackBar.open(`Links can only be generated for published content.`);
      return;
    }

    const authorInfo = content.author as UserInfo;

    if (content.kind === ContentKind.BlogContent) {
      //this.snackBar.open(`Copied link!`);
      return `https://offprint.net/portfolio/${authorInfo._id}/${authorSlug}/blog/${titleSlug}`;
    } else if (content.kind === ContentKind.ProseContent) {
      //this.snackBar.open(`Copied link!`);
      return `https://offprint.net/prose/${content._id}/${titleSlug}`;
    } else if (content.kind === ContentKind.PoetryContent) {
      //this.snackBar.open(`Copied link!`);
      return `https://offprint.net/poetry/${content._id}/${titleSlug}`;
    } else {
      //this.snackBar.open(`Content Kind does not exist.`);
      return;
    }
  }
}
