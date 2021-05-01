import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dragonfish-approve-prose',
    templateUrl: './approve-prose.component.html',
    styleUrls: ['./approve-prose.component.scss'],
})
export class ApproveProseComponent {
    constructor(public route: ActivatedRoute) {}
}
