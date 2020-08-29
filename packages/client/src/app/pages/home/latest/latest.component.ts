import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.less']
})
export class LatestComponent implements OnInit {

  options: Object = {
    htmlAllowComments: false,
    htmlRemoveTags: ['script', 'style', 'base'],    
    pasteDeniedAttrs: [ 'class', 'id', 'contenteditable' ],
    htmlAllowedStyleProps: ['text-align'],
    events: {
      'paste.beforeCleanup': this.pasteBeforeCleanup
    },
  }

  pasteBeforeCleanup(pastedHtml: string): string {    
    // Replace CRLF, CR and LF with <br> elements.
    return pastedHtml.replace(/(?:\r\n|\r|\n)/g, '');
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
