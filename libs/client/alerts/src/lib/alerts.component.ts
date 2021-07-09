import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertModel, AlertType } from './models';

@Component({
    selector: 'dragonfish-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {
    public alertType = AlertType;

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: AlertModel) {}

    ngOnInit(): void {
        switch (this.data.type) {
            case AlertType.Success:
                document.documentElement.style.setProperty('--alert-color', 'rgb(60, 128, 40)');
                break;
            case AlertType.Error:
                document.documentElement.style.setProperty('--alert-color', 'rgb(221, 76, 79)');
                break;
            case AlertType.Info:
                document.documentElement.style.setProperty('--alert-color', 'rgb(80, 154, 233)');
                break;
            case AlertType.Warning:
                document.documentElement.style.setProperty('--alert-color', 'rgb(217, 161, 7)');
        }
    }
}
