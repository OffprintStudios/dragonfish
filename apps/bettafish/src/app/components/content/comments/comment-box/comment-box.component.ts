import { Component, Input } from '@angular/core';
import { Comment } from '@dragonfish/shared/models/comments';

@Component({
    selector: 'dragonfish-comment-box',
    templateUrl: './comment-box.component.html',
    styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent {
    @Input() comment: Comment;
    @Input() index: number;
}
