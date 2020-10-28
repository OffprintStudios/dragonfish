import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Types } from 'mongoose';

import { ContentKind, ContentModel, Folder, PubChange, PubStatus } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { MyStuff } from '../../../models/site';
import { AuthService } from '../../../services/auth';
import { BlogsService } from '../../../services/content';
import { MyStuffService } from '../../../services/user';
import { NewFolderComponent } from './new-folder/new-folder.component';

@Component({
  selector: 'pulp-fiction-my-stuff',
  templateUrl: './my-stuff.component.html',
  styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
  currentUser: FrontendUser;
  myContent: ContentModel[];
  myFolders: Folder[];
  contentKind = ContentKind;
  pubStatus = PubStatus;

  itemSelected = false;
  currSelectedContent: ContentModel;
  currFolder: Folder;
  isFolder = false;

  isIconView = true;

  searchStuff = new FormGroup({
    query: new FormControl('')
  });

  constructor(private stuffService: MyStuffService, public route: ActivatedRoute, private router: Router, private authService: AuthService,
    private blogService: BlogsService, private dialog: MatDialog) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const stuff = data.stuffData as MyStuff;
      this.myContent = stuff.content;
      this.myFolders = stuff.folders;
    });

    this.route.queryParamMap.subscribe(params => {
      const pathId = params.get('folder');
      const folderId = Types.ObjectId(pathId);
      this.stuffService.fetchOneFolder(folderId).subscribe(folder => {
        this.currFolder = folder;
        this.isFolder = true;
      });
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
   * Navigates to the folder page given the provided folder.
   * 
   * @param folder The folder to open
   */
  openFolder(folder: Folder) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {folder: folder._id}, queryParamsHandling: 'merge'});
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
    }
  }

  /**
   * Goes back to normal view.
   */
  goHome() {
    this.currFolder = null;
    this.isFolder = false;
    this.router.navigate([], {relativeTo: this.route});
  }

  /**
   * Opens the new form dialog box via MatDialog.
   */
  openNewFormDialog() {
    const folderFormRef = this.dialog.open(NewFolderComponent, {width: '450px'});
    folderFormRef.afterClosed().subscribe(() => {
      this.router.navigate([], {relativeTo: this.route});
    });
  }
}
