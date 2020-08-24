import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

import { imageHandler, dividerHandler } from '../../util/quill';

@Component({
  selector: 'pulp-fiction-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
  viewProviders: [
    {provide: ControlContainer, useExisting: FormGroupDirective}
  ]
})
export class EditorComponent implements OnInit {
  @Input() minLength: number;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() height: string;

  public styles = {
    'height': '200px',
    'box-shadow': 'none',
    'margin-bottom': '0'
  };

  editorFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align', 'center', 'right', 'justify',
    'list', 'bullet', 'ordered',
    'divider', 'blockquote', 'code', 
    'link', 'image', 'video',
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.styles = {
      'height': this.height,
      'box-shadow': 'none',
      'margin-bottom': '0'
    };
  }

  /**
   * Required for the QuillJS editor.
   */
  triggerChangeDetection() {
    this.cdr.detectChanges();
  }

  /**
   * Gets the Quill Editor object after the editor's creation in the template HTML
   * 
   * @param event The editor object
   */
  onEditorCreated(event: any) {
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('divider', dividerHandler);
    toolbar.addHandler('image', imageHandler);
  }
}
