import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProseContent } from '@dragonfish/shared/models/content';
import { ContentState } from '../../../repo/content';

@Component({
    selector: 'dragonfish-prose-page',
    templateUrl: './prose-page.component.html',
})
export class ProsePageComponent {
    @Select(ContentState.currContent) currProse$: Observable<ProseContent>;

    constructor(public route: ActivatedRoute) {}
}
