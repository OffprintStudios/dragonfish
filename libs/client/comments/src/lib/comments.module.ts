import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '@dragonfish/client/alerts';
import { UiModule } from '@dragonfish/client/ui';
import { PipesModule } from '@dragonfish/client/pipes';
import { MaterialModule } from '@dragonfish/client/material';
import { IconsModule } from '@dragonfish/client/icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MarkdownModule } from 'ngx-markdown';
import { EditorLiteModule } from '@dragonfish/client/editor-lite';

/* Components */
import { CommentsComponent } from './comments.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { NewCommentComponent } from './new-comment/new-comment.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AlertsModule,
        UiModule,
        PipesModule,
        MaterialModule,
        EditorLiteModule,
        IconsModule,
        NgxPaginationModule,
        MarkdownModule.forChild(),
    ],
    declarations: [CommentsComponent, CommentBoxComponent, NewCommentComponent],
    exports: [CommentsComponent],
})
export class CommentsModule {}
