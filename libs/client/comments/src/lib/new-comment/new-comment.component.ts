import { Component, Input } from '@angular/core';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ContentViewService } from '@dragonfish/client/repository/content-view';
import { AlertsService } from '@dragonfish/client/alerts';
import { CommentForm } from '@dragonfish/shared/models/comments';

@Component({
    selector: 'dragonfish-new-comment',
    templateUrl: './new-comment.component.html',
    styleUrls: ['./new-comment.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ height: 65, opacity: 0 }),
                animate('.250s ease-in-out', style({ height: 250, opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: 250, opacity: 1 }),
                animate('.250s ease-in-out', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class NewCommentComponent {
    @Input() currUser!: FrontendUser;
    @Input() itemId!: string;
    collapsed = true;

    newComment = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(private viewService: ContentViewService, private alerts: AlertsService) {}

    toggleCollapsed = () => {
        this.collapsed = !this.collapsed;
        this.newComment.reset();
    };

    submitForm() {
        if (this.newComment.controls.body.invalid) {
            this.alerts.error(`Comments must be longer than 10 characters.`);
            return;
        }

        const form: CommentForm = {
            body: this.newComment.controls.body.value,
            repliesTo: [],
        };

        this.viewService.addComment(this.itemId, form).subscribe(() => {
            this.newComment.reset();
            this.collapsed = true;
        });
    }

    //#region ---PRIVATE---

    private get fields() {
        return this.newComment.controls;
    }

    //#endregion
}
