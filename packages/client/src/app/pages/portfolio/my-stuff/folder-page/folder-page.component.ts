import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContentKind, Folder, PubStatus } from '@pulp-fiction/models/content';

@Component({
  selector: 'pulp-fiction-folder-page',
  templateUrl: './folder-page.component.html',
  styleUrls: ['./folder-page.component.less']
})
export class FolderPageComponent implements OnInit {
  folderData: Folder;

  contentKind = ContentKind;
  pubStatus = PubStatus;

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.folderData = data.folderData as Folder;
      console.log(this.folderData);
    });
  }

  goHome() {
    this.location.back();
  }
}
