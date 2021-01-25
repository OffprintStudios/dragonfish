import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Alert, AlertType } from '../../models';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.less']
})
export class AlertComponent implements OnInit {
    public alertType = AlertType;

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Alert) {}

    ngOnInit(): void {}
}