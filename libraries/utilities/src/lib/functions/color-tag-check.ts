import { AlertsService } from '@dragonfish/alerts';
import { Constants } from '../constants';

export function colorTagCheck(name: string, text: string, alerts: AlertsService): void {
    if (text?.includes("color:#")) {
        alerts.warn(name + Constants.COLOR_WARNING);
    }
}
