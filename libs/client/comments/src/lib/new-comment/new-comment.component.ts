import { Component, Input } from '@angular/core';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

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
    collapsed = true;

    newComment = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    toggleCollapsed = () => {
        this.collapsed = !this.collapsed;
    };

    //#region ---PRIVATE---

    private get fields() {
        return this.newComment.controls;
    }

    //#endregion
}
