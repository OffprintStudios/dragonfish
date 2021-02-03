import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Select } from '@ngxs/store';
import { ContentKind, ContentModel, PubStatus } from '@dragonfish/models/content';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MyStuffState } from '../../../../shared/my-stuff';
import { MyStuffService } from '../../my-stuff.service';

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

    constructor(private stuff: MyStuffService) {}

    ngOnInit(): void {
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

    setCurrContent() {
        this.stuff.setCurrContent(this.content);
    }

    view() {
        this.viewItem.emit(this.content);
    }
}