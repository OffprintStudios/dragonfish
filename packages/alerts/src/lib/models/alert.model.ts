import { AlertType } from './alert-type.enum';

export interface Alert {
    message: string;
    type: AlertType;
}