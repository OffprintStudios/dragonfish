import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/my-stuff/sections';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
    selector: 'dragonfish-view-poetry',
    templateUrl: './view-poetry.component.html',
    styleUrls: ['./view-poetry.component.scss']
})
export class ViewPoetryComponent implements OnInit{
    constructor(
        public route: ActivatedRoute,
        private sections: SectionsService,
        public sectionsQuery: SectionsQuery,
        public stuffQuery: MyStuffQuery,
    ) {}

    ngOnInit() {
        this.sections.setAll(this.stuffQuery.currentId).pipe(untilDestroyed(this)).subscribe();
    }
}
