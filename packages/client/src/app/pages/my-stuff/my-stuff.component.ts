import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { slugify } from 'voca';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyStuffState } from '../../shared/my-stuff';

import { ContentKind, ContentModel, PubChange, PubStatus } from '@pulp-fiction/models/content';
import { UserInfo } from '@pulp-fiction/models/users';
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
  @Select(MyStuffState.myStuff) myStuff$: Observable<ContentModel[]>;
  @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;

  contentKind = ContentKind;
  pubStatus = PubStatus;

  itemSelected = false;
  currSelectedContent: ContentItem;

  isIconView = true;

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, 
    private blogService: BlogsService, private snackBar: MatSnackBar, private clipboard: Clipboard) { }

  ngOnInit(): void {
    Title.setTwoPartTitle(Constants.MY_STUFF);
  }

  /**
   * Marks a content item as selected. If another content item is already selected, the new one will replace that one.
   * 
   * @param content The content item to select
   */
  selectItem(content: ContentItem) {
    if (this.currSelectedContent === null || this.currSelectedContent === undefined) {
      content.isSelected = true;
      this.itemSelected = true;
      this.currSelectedContent = content;
    } else {
      if (this.currSelectedContent._id !== content._id) {
        this.currSelectedContent.isSelected = false;
        content.isSelected = true;
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
    this.currSelectedContent.isSelected = false;
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

  getShareLink(content: ContentModel) {
    if (content.audit.published !== PubStatus.Published) {
      this.snackBar.open(`Links can only be generated for published content.`);
      return;
    }

    const authorInfo = content.author as UserInfo;

    if (content.kind === ContentKind.BlogContent) {
      this.clipboard.copy(`https://offprint.net/portfolio/${authorInfo._id}/${slugify(authorInfo.username)}/blog/${slugify(content.title)}`);
    } else if (content.kind === ContentKind.ProseContent) {
      this.clipboard.copy(`https://offprint.net/prose/${content._id}/${slugify(content.title)}`);
    } else if (content.kind === ContentKind.PoetryContent) {
      this.clipboard.copy(`https://offprint.net/poetry/${content._id}/${slugify(content.title)}`);
    } else {
      this.snackBar.open(`Content Kind does not exist.`);
      return;
    }

    this.snackBar.open(`Copied link!`);
    return;
  }
}
