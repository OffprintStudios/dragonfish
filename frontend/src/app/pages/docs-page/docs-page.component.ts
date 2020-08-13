import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DocsService } from 'src/app/services/admin';
import { Doc } from 'src/app/models/admin';

@Component({
  selector: 'app-docs',
  templateUrl: './docs-page.component.html',
  styleUrls: ['./docs-page.component.less']
})
export class DocsPageComponent implements OnInit {
  loading = false;
  docId: string;

  doc: Doc;

  constructor(private route: ActivatedRoute, private docsService: DocsService) {
    this.fetchData();
  }

  ngOnInit(): void {
  }

  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.docId = params.get('docId');
      console.log(this.docId);
      this.docsService.fetchOne(this.docId).subscribe(doc => {
        this.doc = doc;
        this.loading = false;
      });
    });
  }
}
