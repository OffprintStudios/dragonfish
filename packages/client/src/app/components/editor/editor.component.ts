import * as CKEditor from './ckeditor.js';

import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
  encapsulation: ViewEncapsulation.None, // Disable CSS encapsulation so the .less file can affect the child editor component  
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})

export class EditorComponent implements OnInit {
  @Input() minHeight: string;
  @Input() maxHeight: string;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;  

  editor = CKEditor;
  config: Object = {    
    toolbar: [ 'heading', '|', 
      'bold', 'italic', 'underline', 'strikethrough', '|', 'fontSize', 'fontColor', 'highlight', '|', 
      'bulletedlist', 'numberedlist', '|',
      'alignment', 'indent', 'outdent', '|', 
      'horizontalline', 'blockquote', 'link', 'insertImage', '|',
      'undo', 'redo'],
    placeholder: 'Keeping you on the edge of your seats...',
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    image: {
      styles: [ "alignLeft", "alignCenter", "alignRight", "full" ],
      toolbar: [ "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight", "imageStyle:full" ]
    },
    mediaEmbed: {
      removeProviders: ['googleMaps', 'flickr', 'facebook', 'instagram']
    }
  };

  constructor() { }

  ngOnInit() {
    if (this.minHeight) {
      document.documentElement.style.setProperty('--editor-min-height', this.minHeight);
    } else {
      document.documentElement.style.setProperty('--editor-min-height', '300px');
    }

    if (this.maxHeight) {
      document.documentElement.style.setProperty('--editor-max-height', this.maxHeight);
    } else {
      document.documentElement.style.setProperty('--editor-max-height', '500px');
    }    
  }
}
