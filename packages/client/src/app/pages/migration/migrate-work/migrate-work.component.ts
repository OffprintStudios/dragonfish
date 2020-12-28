import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Work } from '@pulp-fiction/models/works';

@Component({
    selector: 'migrate-work',
    templateUrl: './migrate-work.component.html',
    styleUrls: ['./migrate-work.component.less']
})
export class MigrateWorkComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}