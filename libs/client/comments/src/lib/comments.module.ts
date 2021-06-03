import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '@dragonfish/client/alerts';

/* Components */
import { CommentsComponent } from './comments.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertsModule],
    declarations: [CommentsComponent, CommentBoxComponent],
    exports: [CommentsComponent],
})
export class CommentsModule {}
