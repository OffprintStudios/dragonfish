import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../components';
import { Alert, AlertType } from '../models';

@Injectable()
export class AlertService {
    constructor(private snackBar: MatSnackBar) {}

    /**
     * Displays a success message
     * @param message The message to display
     */
    success(message: string) {
        const alert: Alert = {
            message: message,
            type: AlertType.Success
        };

        this.snackBar.openFromComponent(AlertComponent, {data: alert});
    }

    error(message: string) {
        const alert: Alert = {
            message: message,
            type: AlertType.Error
        };

        this.snackBar.openFromComponent(AlertComponent, {data: alert});
    }

    info(message: string) {
        const alert: Alert = {
            message: message,
            type: AlertType.Info
        };

        this.snackBar.openFromComponent(AlertComponent, {data: alert});
    }

    warn(message: string) {
        const alert: Alert = {
            message: message,
            type: AlertType.Warn
        };

        this.snackBar.openFromComponent(AlertComponent, {data: alert});
    }
}