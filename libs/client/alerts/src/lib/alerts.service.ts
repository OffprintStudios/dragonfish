import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertModel, AlertType } from './models';
import { AlertsComponent } from './alerts.component';

@Injectable()
export class AlertsService {
    constructor(private snackBar: MatSnackBar) {}

    success(message: string) {
        const alert: AlertModel = {
            message: message,
            type: AlertType.Success,
        };
        this.snackBar.openFromComponent(AlertsComponent, { data: alert });
    }

    error(message: string) {
        const alert: AlertModel = {
            message: message,
            type: AlertType.Error,
        };
        this.snackBar.openFromComponent(AlertsComponent, { data: alert });
    }

    info(message: string) {
        const alert: AlertModel = {
            message: message,
            type: AlertType.Info,
        };
        this.snackBar.openFromComponent(AlertsComponent, { data: alert });
    }

    warn(message: string) {
        const alert: AlertModel = {
            message: message,
            type: AlertType.Warning,
        };
        this.snackBar.openFromComponent(AlertsComponent, { data: alert });
    }
}
