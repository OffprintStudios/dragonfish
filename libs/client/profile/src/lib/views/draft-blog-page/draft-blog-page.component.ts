import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogsContentModel } from '@dragonfish/shared/models/content';
import { map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'dragonfish-draft-blog-page',
    templateUrl: './draft-blog-page.component.html',
    styleUrls: ['./draft-blog-page.component.scss'],
})
export class DraftBlogPageComponent implements OnInit {
    blog: BlogsContentModel;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data
            .pipe(
                map((content) => {
                    this.blog = content as BlogsContentModel;
                }),
                untilDestroyed(this),
            )
            .subscribe();
    }
}
