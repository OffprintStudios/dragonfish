import { Component } from '@angular/core';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';

@Component({
    selector: 'dragonfish-content-home',
    templateUrl: 'content-home.component.html',
    styleUrls: ['./content-home.component.scss'],
})
export class ContentHomeComponent {
    constructor(public pageQuery: WorkPageQuery) {}
}
