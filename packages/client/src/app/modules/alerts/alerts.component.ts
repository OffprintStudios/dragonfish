import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from './alerts';
import { AlertsService } from './alerts.service';

@Component({
  selector: 'alert',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.less']
})
export class AlertsComponent implements OnInit, OnDestroy {
  @Input() id: string;

  alerts: Alert[] = [];
  subscription: Subscription;

  constructor(private alertsService: AlertsService) { }

  ngOnInit() {
    this.subscription = this.alertsService.onAlert(this.id)
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }
        this.alerts.push(alert);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-error';
      case AlertType.Info:
        return 'alert alert-info';
      case AlertType.Warning:
        return 'alert alert-warning';
    }
  }
}
