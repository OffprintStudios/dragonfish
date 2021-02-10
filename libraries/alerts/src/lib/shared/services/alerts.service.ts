import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Alerts } from '../alerts.actions';

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    @Dispatch()
    public success(message: string) {
        return new Alerts.Success(message);
    }

    @Dispatch()
    public error(message: string) {
        return new Alerts.Error(message);
    }

    @Dispatch()
    public info(message: string) {
        return new Alerts.Info(message);
    }

    @Dispatch()
    public warn(message: string) {
        return new Alerts.Warning(message);
    }
}
