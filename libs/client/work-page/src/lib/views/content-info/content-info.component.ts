import { Component } from '@angular/core';
import { WorkPageQuery } from '@dragonfish/client/repository/work-page';

@Component({
    selector: 'dragonfish-content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.scss'],
})
export class ContentInfoComponent {
    constructor(public workQuery: WorkPageQuery) {}
}
