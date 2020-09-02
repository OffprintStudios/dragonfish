import * as CKEditor from './ckeditor.js';

import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'editor',
  templateUrl: './new-editor.component.html',
  styleUrls: ['./new-editor.component.less'],
  encapsulation: ViewEncapsulation.None, // Disable CSS encapsulation so the .less file can affect the child editor component  
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})

export class NewEditorComponent implements OnInit {
  @Input() minHeight: string;
  @Input() maxHeight: string;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;

  editor = CKEditor;
  config: Object = {
    // Todo: configure toolbar properly
    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html for details
    toolbar: [ 'heading', '|', 'fontsize', 'fontcolor', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'bulletedlist', 'numberedlist', '|',
    'alignment', 'indent', 'outdent', '|', 'horizontalline', 'blockquote', 'link', 'imageupload', 'mediaembed', '|',
    'undo', 'redo'],
    placeholder: 'Keeping you on the edge of your seats...',
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'Heading 1', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 2', class: 'ck-heading_heading3' }
      ]
    },
    image: {
      upload: {
        panel: {
          items: [ 'insertimageviaurl' ]
        }
      }
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
