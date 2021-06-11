import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditorComponent } from './editor.component';

@NgModule({
    declarations: [EditorComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [EditorComponent],
})
export class EditorModule {}
