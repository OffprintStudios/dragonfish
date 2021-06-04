import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '@dragonfish/client/alerts';
import { UiModule } from '@dragonfish/client/ui';
import { PipesModule } from '@dragonfish/client/pipes';
import { MaterialModule } from '@dragonfish/client/material';
import { EditorModule } from '@dragonfish/client/editor';
import { IconsModule } from '@dragonfish/client/icons';
import { NgxPaginationModule } from 'ngx-pagination';

/* Components */
import { CommentsComponent } from './comments.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AlertsModule,
        UiModule,
        PipesModule,
        MaterialModule,
        EditorModule,
        IconsModule,
        NgxPaginationModule,
    ],
    declarations: [CommentsComponent, CommentBoxComponent],
    exports: [CommentsComponent],
})
export class CommentsModule {}
