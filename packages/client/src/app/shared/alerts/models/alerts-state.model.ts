import { AlertType } from './alert-type.enum';

export interface AlertsStateModel {
    message: string;
    type: AlertType;
}
