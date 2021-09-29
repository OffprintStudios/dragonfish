import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorLiteComponent } from './editor-lite.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { MarkdownModule } from 'ngx-markdown';
import { AlertsModule } from '@dragonfish/client/alerts';
import { InsertMediaComponent } from './components/insert-media/insert-media.component';
import { InsertLinkComponent } from './components/insert-link/insert-link.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PipesModule } from '@dragonfish/client/pipes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconsModule,
        MaterialModule,
        MarkdownModule.forChild(),
        AlertsModule,
        NgxTiptapModule,
        PickerModule,
        PipesModule,
    ],
    declarations: [EditorLiteComponent, InsertLinkComponent, InsertMediaComponent],
    exports: [EditorLiteComponent],
})
export class EditorLiteModule {}
