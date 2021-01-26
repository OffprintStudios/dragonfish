import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { ContentKind, ContentModel, PubStatus } from '@pulp-fiction/models/content';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MyStuff, MyStuffState } from '../../../shared/my-stuff';

@UntilDestroy()
@Component({
    selector: 'content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.less']
})
export class ContentItemComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;

    @Input() content: ContentModel;
    @Output() viewItem = new EventEmitter<ContentModel>();
    selected: boolean = false;

    contentKind = ContentKind;
    pubStatus = PubStatus;

    constructor() {
        this.currContent$.pipe(untilDestroyed(this)).subscribe(x => {
            if (x !== null) {
                if (x._id === this.content._id) {
                    this.selected = true;
                } else {
                    this.selected = false;
                }
            } else {
                this.selected = false;
            }
        });
    }

    ngOnInit(): void {}

    @Dispatch()
    setCurrContent() {
        return new MyStuff.SetCurrentContent(this.content);
    }

    view() {
        this.viewItem.emit(this.content);
    }
}