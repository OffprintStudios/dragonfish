import 'froala-editor/js/plugins/align.min.js'; // Adds alignment options
import 'froala-editor/js/plugins/colors.min.js'; // Adds custom color options
import 'froala-editor/js/plugins/font_size.min.js'; // Adds font size customization
import 'froala-editor/js/plugins/fullscreen.min.js' // Adds the fullscreen button
import 'froala-editor/js/plugins/url.min.js'; // Detects if a url is typed and adds it appropriately
import 'froala-editor/js/plugins//image.min.js' // Adds the insertImage option and associated functionality
import 'froala-editor/js/plugins/video.min.js'; // Adds the insertVideo option and associated functionality
import 'froala-editor/js/plugins/quick_insert.min.js'; // Adds quick insert functionality
import 'froala-editor/js/plugins/emoticons.min.js'; // Adds emoticons functionality
import 'froala-editor/js/plugins/link.min.js' // Add the insertLink option and associated functionality
import 'froala-editor/js/plugins/lists.min.js' // Adds <ul> and <ol> functionality
import 'froala-editor/js/plugins/paragraph_format.min.js' // import the header styles formatter
import 'froala-editor/js/plugins/quote.min.js' // Adds the "blockquote" option
import { Component, ViewEncapsulation, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'froala-pulp-fiction-editor',
  templateUrl: './froala-editor.component.html',
  styleUrls: ['./froala-editor.component.less'],
  encapsulation: ViewEncapsulation.None, // Disable CSS encapsulation so the .less file can affect the child froala-editor component
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FroalaEditorComponent),
      multi: true
    }
  ]
})

export class FroalaEditorComponent implements ControlValueAccessor, OnInit {
  @Input() minHeight: string;
  @Input() maxHeight: string;

  model: any;
  options: Object = {
    attribution: false,
    htmlAllowComments: false,
    htmlRemoveTags: ['script', 'style', 'base'],
    pasteDeniedAttrs: ['class', 'id', 'contenteditable'],
    htmlAllowedStyleProps: ['text-align'],
    events: {
      'paste.beforeCleanup': this.pasteBeforeCleanup
    },
    theme: "offprint",
    imageMove: false, // don't allow dragging of imgaes
    imageUpload: false,
    imageInsertButtons: ['imageBack', '|', 'imageByURL', 'imageManager'], // Default buttons include an "insert directly" button, which we don't allow
    videoInsertButtons: ['videoBack', 'videoByURL'],
    videoAllowedProviders: ['youtube', 'vimeo'],
    toolbarButtons: {
      moreText: {
        buttons: ['paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'fontSize'],
        align: 'left',
        buttonsVisible: 6
      },
      moreParagraph: {
        buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatUL', 'formatOL', 'quote', 'outdent', 'indent'],
        align: 'left',
        buttonsVisible: 4
      },
      moreRich: {
        buttons: ['clearFormatting', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'emoticons'],
        align: 'left',
        buttonsVisible: 3,
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen', 'spellChecker'],
        align: 'right',
        buttonsVisible: 4
      }
    }
  }

  // Required for ControlValueAccessor
  onChange = (_) => {};
  onTouched = (_) => {};
  //end

  pasteBeforeCleanup(pastedHtml: string): string {
    // Strip out spurious newline characters. <br> or bust, baby
    return pastedHtml.replace(/(?:\r\n|\r|\n)/g, '');
  }

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

  // Required for ControlValueAccessor
  writeValue(content: any): void {
    this.model = content;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  // Required for ControlValueAccessor
}
