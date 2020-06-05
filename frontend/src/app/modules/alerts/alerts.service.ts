import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alerts';

@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = true;

    constructor(private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    this.keepAfterRouteChange = true;
                } else {
                    this.clear();
                }
            }
        });
    }

    onAlert(alertId?: string) {
        return this.subject.asObservable().pipe(filter(x => x && x.alertId === alertId));
    }

    success(message: string, alertId?: string) {
        this.alert(new Alert({ title: 'Awesome!', message, type: AlertType.Success, alertId}));
    }

    error(message: string, alertId?: string) {
        this.alert(new Alert({title: 'Uh-oh.', message, type: AlertType.Error, alertId}));
    }

    info(message: string, alertId?: string) {
        this.alert(new Alert({title: 'Head\'s up:', message, type: AlertType.Info, alertId}));
    }

    warn(message: string, alertId?: string) {
        this.alert(new Alert({title: 'Something isn\'t right...', message, type: AlertType.Warning, alertId}));
    }

    alert(alert: Alert) {
        this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    clear(alertId?: string) {
        this.subject.next(new Alert({ alertId }));
    }
}
