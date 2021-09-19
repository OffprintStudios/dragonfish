import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-blogs-list',
    templateUrl: './blogs-list.component.html',
    styleUrls: ['./blogs-list.component.scss'],
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
export class BlogsListComponent {
    collapsed = true;

    blogForm = new FormGroup({
        title: new FormControl(''),
        body: new FormControl(''),
        saveAsDraft: new FormControl(false),
    });

    constructor(public pseudQuery: PseudonymsQuery, public auth: AuthService, public sessionQuery: SessionQuery) {}

    toggleForm() {
        this.collapsed = !this.collapsed;
        this.blogForm.reset();
    }
}
