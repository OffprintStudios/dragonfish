import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ContentKind, ContentModel, PubStatus } from '@dragonfish/models/content';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MyStuffState, MyStuff } from '../../shared';

@UntilDestroy()
@Component({
    selector: 'content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.less'],
})
export class ContentItemComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;

    @Input() content: ContentModel;
    @Output() viewItem = new EventEmitter<ContentModel>();
    selected: boolean = false;

    contentKind = ContentKind;
    pubStatus = PubStatus;

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe((x) => {
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

    setCurrContent() {
        this.store.dispatch(new MyStuff.SetCurrentContent(this.content));
    }

    view() {
        this.viewItem.emit(this.content);
    }
}
