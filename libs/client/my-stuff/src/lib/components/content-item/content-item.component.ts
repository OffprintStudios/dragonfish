import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ContentKind, ContentModel, PubStatus} from '@dragonfish/shared/models/content';
import { MyStuffState } from '../../repo';
import { MyStuffService } from '../../repo/services';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@UntilDestroy()
@Component({
    selector: 'dragonfish-content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.scss'],
})
export class ContentItemComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;
    @Input() content: ContentModel;
    @Output() viewItem = new EventEmitter<ContentModel>();
    selected = false;
    contentKind = ContentKind;
    pubStatus = PubStatus;
    menu = ContextMenuComponent;

    constructor(private stuff: MyStuffService) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe(x => {
            if (x !== null) {
                this.selected = x._id === this.content._id;
            } else {
                this.selected = false;
            }
        });
    }

    setCurrContent() {
        this.stuff.setCurrentContent(this.content);
    }

    view() {
        this.viewItem.emit(this.content);
    }

    deselect() {
        this.stuff.setCurrentContent(null);
    }
}
