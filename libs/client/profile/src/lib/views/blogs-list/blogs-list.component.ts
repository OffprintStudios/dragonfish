import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { ContentService } from '../../repo';
import { BlogsContentModel } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-blogs-list',
    templateUrl: './blogs-list.component.html',
    styleUrls: ['./blogs-list.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ height: 65, opacity: 0 }),
                animate('.250s ease-in-out', style({ height: 250, opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: 250, opacity: 1 }),
                animate('.250s ease-in-out', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class BlogsListComponent implements OnInit {
    blogs: BlogsContentModel[];
    publishedBlogs: BlogsContentModel[];
    draftBlogs: BlogsContentModel[];
    loading = false;
    collapsed = true;

    blogForm = new FormGroup({
        title: new FormControl(''),
        body: new FormControl(''),
    });

    constructor(
        public pseudQuery: PseudonymsQuery,
        public auth: AuthService,
        public sessionQuery: SessionQuery,
        private content: ContentService,
    ) {}

    ngOnInit() {
        this.fetchData();
    }

    toggleForm() {
        this.collapsed = !this.collapsed;
        this.blogForm.reset();
    }

    private fetchData() {
        this.loading = true;
        this.content.fetchBlogs(this.pseudQuery.currentId).subscribe((content) => {
            this.blogs = content as BlogsContentModel[];

            this.publishedBlogs = content.filter((item) => {
                return item.audit.published === 'Published';
            }) as BlogsContentModel[];
            this.draftBlogs = content.filter((item) => {
                return item.audit.published === 'Unpublished';
            }) as BlogsContentModel[];

            this.loading = false;
        });
    }
}
