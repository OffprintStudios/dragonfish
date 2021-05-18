import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-docs',
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent {
    constructor(public route: ActivatedRoute, public sessionQuery: SessionQuery) {}
}
