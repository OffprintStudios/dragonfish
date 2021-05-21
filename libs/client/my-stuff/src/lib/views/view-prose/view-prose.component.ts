import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { SectionsQuery, SectionsService } from '@dragonfish/client/repository/my-stuff/sections';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-view-prose',
    templateUrl: './view-prose.component.html',
    styleUrls: ['./view-prose.component.scss']
})
export class ViewProseComponent implements OnInit {
    constructor(
        public route: ActivatedRoute,
        public stuffQuery: MyStuffQuery,
        private sections: SectionsService,
        public sectionsQuery: SectionsQuery,
    ) {}

    ngOnInit() {
        this.sections.setAll(this.stuffQuery.currentId).pipe(untilDestroyed(this)).subscribe();
    }
}
