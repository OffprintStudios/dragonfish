import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditorComponent } from './editor.component';

@NgModule({
    declarations: [EditorComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
    exports: [EditorComponent],
})
export class EditorModule {}
