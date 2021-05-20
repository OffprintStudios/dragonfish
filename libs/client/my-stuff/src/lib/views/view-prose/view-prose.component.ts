import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyStuffQuery } from '@dragonfish/client/repository/my-stuff';

@Component({
    selector: 'dragonfish-view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.scss']
})
export class ViewProseComponent {
    constructor(
        public route: ActivatedRoute,
        public stuffQuery: MyStuffQuery,
    ) {}
}
