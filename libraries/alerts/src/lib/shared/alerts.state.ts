import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { State, Action, StateContext } from '@ngxs/store';

import { Alerts } from './alerts.actions';
import { AlertsComponent } from './components';
import { AlertType } from './models';
import { AlertsStateModel } from './models/alerts-state.model';

@State<AlertsStateModel>({
    name: 'alerts',
    defaults: {
        message: null,
        type: null,
    },
})
@Injectable()
export class AlertsState {
    constructor(private snackBar: MatSnackBar) {}

    @Action(Alerts.Success)
    success({ patchState, getState }: StateContext<AlertsStateModel>, { message }: Alerts.Success) {
        patchState({
            message: message,
            type: AlertType.Success,
        });
        this.snackBar.openFromComponent(AlertsComponent, { data: getState() });
    }

    @Action(Alerts.Error)
    error({ patchState, getState }: StateContext<AlertsStateModel>, { message }: Alerts.Error) {
        patchState({
            message: message,
            type: AlertType.Error,
        });
        this.snackBar.openFromComponent(AlertsComponent, { data: getState() });
    }

    @Action(Alerts.Info)
    info({ patchState, getState }: StateContext<AlertsStateModel>, { message }: Alerts.Info) {
        patchState({
            message: message,
            type: AlertType.Info,
        });
        this.snackBar.openFromComponent(AlertsComponent, { data: getState() });
    }

    @Action(Alerts.Warning)
    warning({ patchState, getState }: StateContext<AlertsStateModel>, { message }: Alerts.Warning) {
        patchState({
            message: message,
            type: AlertType.Warning,
        });
        this.snackBar.openFromComponent(AlertsComponent, { data: getState() });
    }
}
