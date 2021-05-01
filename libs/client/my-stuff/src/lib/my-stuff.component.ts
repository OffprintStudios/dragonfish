import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyStuffState, MyStuffStateModel } from './repo';
import { ContentModel, ContentKind } from '@dragonfish/shared/models/content';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { MyStuffService } from './repo/services';

@Component({
    selector: 'dragonfish-my-stuff',
    templateUrl: './my-stuff.component.html',
    styleUrls: ['./my-stuff.component.scss'],
})
export class MyStuffComponent implements OnInit {
    @Select(MyStuffState) myStuff$: Observable<MyStuffStateModel>;
    isIconView = true;
    loading = false;

    constructor(public route: ActivatedRoute, public router: Router, private myStuff: MyStuffService) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.MY_STUFF);
        this.fetchData();
    }

    private fetchData() {
        this.loading = true;
        this.myStuff.setFiles().then(() => {
            this.loading = false;
        });
    }

    deselect() {
        this.myStuff.setCurrentContent(null);
    }

    /**
     * Navigates to the specified view page.
     *
     * @param content The content item to view
     */
    viewContent(content: ContentModel) {
        if (content.kind === ContentKind.BlogContent) {
            this.router.navigate(['view-blog'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.NewsContent) {
            this.router.navigate(['view-post'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.ProseContent) {
            this.router.navigate(['view-prose'], { relativeTo: this.route }).catch(err => console.log(err));
        } else if (content.kind === ContentKind.PoetryContent) {
            this.router.navigate(['view-poetry'], { relativeTo: this.route }).catch(err => console.log(err));
        }
    }
}
