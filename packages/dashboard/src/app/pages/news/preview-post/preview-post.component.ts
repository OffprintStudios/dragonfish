import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';

@Component({
  selector: 'pulp-fiction-preview-post',
  templateUrl: './preview-post.component.html',
  styleUrls: ['./preview-post.component.less']
})
export class PreviewPostComponent implements OnInit {
  currPost: NewsContentModel;
  pageErrorHeader: string = `Preview unavailable.`;
  pageErrorSubtitle: string = `You sure this post exists?`;

  category = NewsCategory;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currPost = this.route.snapshot.data.post as NewsContentModel;
  }
}
