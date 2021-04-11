import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ContentState } from '../../../repo/content';
import { Observable } from 'rxjs';
import { PoetryContent } from '@dragonfish/shared/models/content';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dragonfish-poetry-page',
    templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
    @Select(ContentState.currContent) currPoetry$: Observable<PoetryContent>;

    constructor(public route: ActivatedRoute) {}
}
