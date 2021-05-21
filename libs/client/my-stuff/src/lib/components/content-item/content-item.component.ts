import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContentKind, ContentModel, PubStatus} from '@dragonfish/shared/models/content';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';

@UntilDestroy()
@Component({
    selector: 'dragonfish-content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.scss'],
})
export class ContentItemComponent implements OnInit {
    @Input() content: ContentModel;
    @Output() viewItem = new EventEmitter<ContentModel>();
    selected = false;
    contentKind = ContentKind;
    pubStatus = PubStatus;
    menu = ContextMenuComponent;

    constructor(private stuff: MyStuffService, public myStuffQuery: MyStuffQuery) {}

    ngOnInit(): void {
        this.myStuffQuery.current$.pipe(untilDestroyed(this)).subscribe(x => {
            if (x !== null && x !== undefined) {
                this.selected = x._id === this.content._id;
            } else {
                this.selected = false;
            }
        });
    }

    setCurrContent() {
        console.log(`setting active content`);
        this.stuff.setActive(this.content._id);
    }

    view() {
        this.viewItem.emit(this.content);
    }

    deselect() {
        this.stuff.setActive(null);
    }
}
