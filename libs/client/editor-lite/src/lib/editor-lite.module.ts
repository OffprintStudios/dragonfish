import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorLiteComponent } from './editor-lite.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsModule, MaterialModule],
    declarations: [EditorLiteComponent],
    exports: [EditorLiteComponent],
})
export class EditorLiteModule {}
