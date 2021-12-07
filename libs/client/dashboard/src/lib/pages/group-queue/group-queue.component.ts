import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-group-queue',
    templateUrl: './group-queue.component.html',
    styleUrls: ['./group-queue.component.scss'],
})
export class GroupQueueComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.DASHBOARD, Constants.GROUPS);
    }
}
