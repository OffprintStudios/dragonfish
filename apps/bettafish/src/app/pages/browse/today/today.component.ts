import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../../services';
import { ContentModel } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
    loadingNew = false;

    newWorks: ContentModel[];

    constructor(private network: NetworkService) {}

    ngOnInit() {
        this.loadFirstNew();
    }

    loadFirstNew() {
        this.loadingNew = true;
        this.network.fetchFirstNew().subscribe(result => {
            this.newWorks = result;
            this.loadingNew = false;
        }, () => {
            this.loadingNew = false;
        });
    }
}
